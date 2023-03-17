import {readFile, writeFile} from 'node:fs/promises';
import * as path from 'path';
import {Theme} from './models/theme';
import StyleDictionary = require('style-dictionary');
import {coreTokensConfig, themesConfig} from './config';
import {Token} from './models/token';
import {capitalCase} from 'capital-case';
import {Config} from 'style-dictionary';
import {
  androidThemeAttrsFormat,
  androidThemeFormat,
} from './formatters/android_formatters';
import {
  iOSBaseColorsFormatter,
  iOSThemeColorsProtocolFormatter,
  iOSThemeProtocolFormatter,
} from './formatters/ios_formatters';
import {registerTransforms} from '@tokens-studio/sd-transforms';

function weaverFileHeader(version: string): string[] {
  return ['Generated file', 'Do not edit directly', `Version: ${version}`];
}

function runStyleDictionary(config: Config) {
  StyleDictionary.extend(config).buildAllPlatforms();
}

async function readThemes(inputPath: string): Promise<Theme[]> {
  let themes: Theme[];
  if (inputPath.endsWith('.json')) {
    const inputContent = await readFile(inputPath, {
      encoding: 'utf-8',
      flag: 'r',
    });
    themes = JSON.parse(inputContent)['$themes'];
  } else {
    const themesFileContent = await readFile(
      path.join(inputPath, '$themes.json'),
      {encoding: 'utf-8', flag: 'r'}
    );
    themes = JSON.parse(themesFileContent);
  }
  return themes;
}

async function generateCoreTokens(
  inputPath: string,
  outputPath: string,
  projectName: string,
  themes: Theme[]
) {
  // Combine all theme tokens to create a single theme token file
  const themeTokens = <Token>{};
  for (const theme of themes) {
    const themeContent = await readFile(
      `${inputPath}/theme/${theme.name}.json`,
      {
        encoding: 'utf-8',
        flag: 'r',
      }
    );
    const themeJson = JSON.parse(themeContent);
    for (const key in themeJson) {
      if (!themeTokens[key]) themeTokens[key] = themeJson[key];
    }
  }

  // Write temp file with unified theme tokens to use it for Style Dictionary
  await writeFile(
    path.join(inputPath, 'theme_tokens.json'),
    JSON.stringify(themeTokens)
  );

  runStyleDictionary(
    coreTokensConfig(
      [`${inputPath}/theme_tokens.json`, `${inputPath}/core.json`],
      path.join(outputPath, 'core')
    )
  );
}

async function generateThemes(
  inputPath: string,
  outputPath: string,
  projectName: string,
  themes: Theme[]
) {
  for (const theme of themes) {
    runStyleDictionary(
      themesConfig(
        [`${inputPath}/theme/${theme.name}.json`, `${inputPath}/core.json`],
        path.join(outputPath, theme.name),
        theme.name,
        projectName
      )
    );
  }
}

async function configStyleDictionary(projectName: string, version: string) {
  // Formats
  StyleDictionary.registerFormat({
    name: 'androidThemeAttrsFormat',
    formatter: args => androidThemeAttrsFormat(args),
  })
    .registerFormat({
      name: 'androidThemeFormat',
      formatter: args => androidThemeFormat(args),
    })
    .registerFormat({
      name: 'iOSBaseColorsFormatter',
      formatter: args => iOSBaseColorsFormatter(args),
    })
    .registerFormat({
      name: 'iOSThemeColorsProtocolFormatter',
      formatter: args => iOSThemeColorsProtocolFormatter(args),
    })
    .registerFormat({
      name: 'iOSThemeColorsProtocolFormatter',
      formatter: args => iOSThemeColorsProtocolFormatter(args),
    })
    .registerFormat({
      name: 'iOSThemeProtocolFormatter',
      formatter: args => iOSThemeProtocolFormatter(args),
    });

  // Transforms
  await registerTransforms(StyleDictionary);

  // File Headers
  StyleDictionary.registerFileHeader({
    name: 'weaverFileHeader',
    fileHeader: () => weaverFileHeader(version),
  });
}

async function run() {
  // Get input and output path
  const inputPath = path.join(__dirname, '../sample_tokens');
  const outputPath = path.join(__dirname, '../output');
  const projectName = capitalCase('App');
  const version = '1';

  await configStyleDictionary(projectName, version);

  const themes = await readThemes(inputPath);

  await Promise.all([
    generateCoreTokens(inputPath, outputPath, projectName, themes),
    generateThemes(inputPath, outputPath, projectName, themes),
  ]);
}

run().catch(error => console.log('Failed to run weaver: ', error));

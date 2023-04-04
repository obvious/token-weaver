import {readFile, writeFile} from 'node:fs/promises';
import * as path from 'path';
import StyleDictionary = require('style-dictionary');
import {coreTokensConfig, themesConfig} from './config';
import {Token} from './models/token';
import {capitalCase} from 'capital-case';
import {Config} from 'style-dictionary';
import {
  androidThemeAttrsFormatter,
  androidThemeFormatter,
  androidTypographyFormatter,
} from './formatters/android_formatters';
import {
  iOSBaseColorsFormatter,
  iOSThemeColorsFormatter,
  iOSThemeColorsProtocolFormatter,
  iOSThemeFormatter,
  iOSThemeProtocolFormatter,
} from './formatters/ios_formatters';
import {registerTransforms} from '@tokens-studio/sd-transforms';
import {getInput} from '@actions/core';
import {transformTypographyForXml} from './transformers/android_xml_tyopgraphy';
import {readTokens, tempTokensDirPath} from './reader/tokens_reader';

run().catch(error => console.log('Failed to run weaver: ', error));

async function run() {
  // Get input and output path
  const inputPath = path.join(
    process.env.GITHUB_WORKSPACE as string,
    getInput('tokens_path', {required: true})
  );
  const outputPath = path.join(
    process.env.GITHUB_WORKSPACE as string,
    getInput('output_path', {required: true})
  );
  const projectName = capitalCase(getInput('project_name') ?? 'App');
  const version: string | undefined = getInput('version') ?? undefined;

  await configStyleDictionary(projectName, version);

  const tokens = await readTokens(inputPath);

  await Promise.all([
    generateCoreTokens(
      projectName,
      tokens.coreTokensPath,
      tokens.themeTokensPaths,
      outputPath
    ),
    generateThemes(projectName, tokens.themeTokensPaths, outputPath),
  ]);
}

async function generateCoreTokens(
  projectName: string,
  coreJsonPath: string,
  themeTokensPaths: string[],
  outputPath: string
) {
  // Combine all theme tokens to create a single theme token file
  const themeTokens = <Token>{};
  for (const themeTokensPath of themeTokensPaths) {
    const themeContent = await readFile(themeTokensPath, {
      encoding: 'utf-8',
      flag: 'r',
    });
    const themeJson = JSON.parse(themeContent);
    for (const key in themeJson) {
      if (!themeTokens[key]) themeTokens[key] = themeJson[key];
    }
  }

  const themeTokensPath = path.join(tempTokensDirPath(), 'theme_tokens.json');

  await writeFile(themeTokensPath, JSON.stringify(themeTokens));

  runStyleDictionary(
    coreTokensConfig(
      [themeTokensPath, coreJsonPath],
      `${outputPath}/core`,
      projectName
    )
  );
}

async function generateThemes(
  projectName: string,
  themeTokensPaths: string[],
  outputPath: string
) {
  for (const themeTokensPath of themeTokensPaths) {
    const themeName = path.basename(themeTokensPath, '.json');
    runStyleDictionary(
      themesConfig(
        [themeTokensPath, `${tempTokensDirPath()}/core.json`],
        `${outputPath}/${themeName}`,
        themeName,
        projectName
      )
    );
  }
}

function runStyleDictionary(config: Config) {
  StyleDictionary.extend(config).buildAllPlatforms();
}

async function configStyleDictionary(
  projectName: string,
  version: string | undefined
) {
  // Formats
  StyleDictionary.registerFormat({
    name: 'android/text_appearance',
    formatter: args => androidTypographyFormatter(args),
  })
    .registerFormat({
      name: 'android/attrs',
      formatter: args => androidThemeAttrsFormatter(args),
    })
    .registerFormat({
      name: 'android/theme',
      formatter: args => androidThemeFormatter(args),
    })
    .registerFormat({
      name: 'ios/base_colors',
      formatter: args => iOSBaseColorsFormatter(args),
    })
    .registerFormat({
      name: 'ios/theme_colors_protocol',
      formatter: args => iOSThemeColorsProtocolFormatter(args),
    })
    .registerFormat({
      name: 'ios/theme_protocol',
      formatter: args => iOSThemeProtocolFormatter(args),
    })
    .registerFormat({
      name: 'ios/theme_colors',
      formatter: args => iOSThemeColorsFormatter(args),
    })
    .registerFormat({
      name: 'ios/theme',
      formatter: args => iOSThemeFormatter(args),
    });

  // Transforms
  await registerTransforms(StyleDictionary);

  StyleDictionary.registerTransform({
    name: 'weaver/typography/xml',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'typography',
    transformer: token => transformTypographyForXml(token.value),
  });

  // File Headers
  StyleDictionary.registerFileHeader({
    name: 'weaverFileHeader',
    fileHeader: () => weaverFileHeader(version),
  });
}

function weaverFileHeader(version: string | undefined): string[] {
  const header = ['Generated file', 'Do not edit directly'];
  if (version !== undefined) {
    header.push(`Version: ${version}`);
  }
  return header;
}

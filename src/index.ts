import * as StyleDictionary from 'style-dictionary';
import {config} from './config';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {getInput} from '@actions/core';
import * as path from 'path';
const {transformTokens} = require('token-transformer');

async function transformAndWriteTokens(tokensOutput: string): Promise<string> {
  const transformerOptions = {
    expandTypography: false,
    expandShadow: false,
    expandComposition: false,
    expandBorder: false,
    preserveRawValue: false,
    throwErrorWhenNotResolved: false,
    resolveReferences: false,
  };

  const tempDirectoryPath = 'build/tokens';
  await mkdir(tempDirectoryPath, {recursive: true});

  const styleDictionaryTokensPath = `${tempDirectoryPath}/sd_tokens.json`;
  const styleDictionaryTokens = transformTokens(
    JSON.parse(tokensOutput),
    [],
    [],
    transformerOptions
  );
  await writeFile(
    styleDictionaryTokensPath,
    JSON.stringify(styleDictionaryTokens, null, 2)
  );

  return styleDictionaryTokensPath;
}

async function run() {
  try {
    const tokensInputPath = path.join(
      process.env.GITHUB_WORKSPACE as string,
      getInput('tokens_path', {required: true})
    );
    const outputPath = path.join(
      process.env.GITHUB_WORKSPACE as string,
      getInput('output_path', {required: true})
    );

    // Transform tokens
    const tokensData = await readFile(tokensInputPath, {
      encoding: 'utf-8',
      flag: 'r',
    });

    const styleDictionaryTokensPath = await transformAndWriteTokens(tokensData);

    // Run Style Dictionary
    StyleDictionary.extend(
      config(styleDictionaryTokensPath, outputPath)
    ).buildAllPlatforms();
  } catch (e) {
    console.log(e);
  }
}

run();

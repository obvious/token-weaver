import * as StyleDictionary from 'style-dictionary';
import {config} from './config';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {getInput} from '@actions/core';
import * as path from 'path';
const {transformTokens} = require('token-transformer');

async function transformAndWriteTokens(tokensOutput: String): Promise<String> {
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
    JSON.parse(tokensOutput.toString()),
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
    // Transform tokens
    const tokensInputPath = path.join(
      process.env.GITHUB_WORKSPACE as string,
      getInput('tokens_path', {required: true})
    );
    const tokensOutput = await readFile(tokensInputPath, {
      encoding: 'utf-8',
      flag: 'r',
    });

    const styleDictionaryTokensPath = await transformAndWriteTokens(
      tokensOutput
    );

    // Run Style Dictionary
    StyleDictionary.extend(
      config(styleDictionaryTokensPath)
    ).buildAllPlatforms();
  } catch (e) {
    console.log(e);
  }
}

run();

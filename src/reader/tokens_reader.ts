import {readFile, writeFile, mkdir} from 'node:fs/promises';
import * as path from 'path';
import {existsSync} from 'fs';
import {Theme} from '../models/theme';

const fse = require('fs-extra');

const TEMP_TOKENS_FOLDER = 'temp_tokens';

const themeName = (theme: Theme) => `theme/${theme.name}`;
export const tempTokensDirPath = () =>
  path.join(__dirname, '..', TEMP_TOKENS_FOLDER);

export async function readTokens(tokensPath: string): Promise<{
  coreTokensPath: string;
  themeTokensPaths: string[];
}> {
  if (hasSingleTokensFile(tokensPath)) {
    await splitTokensFile(tokensPath);
  } else {
    await copyToTempDir(tokensPath);
  }

  const tokensDirPath = tempTokensDirPath();
  const themes: Theme[] = JSON.parse(
    await readFile(path.join(tokensDirPath, '$themes.json'), {
      encoding: 'utf-8',
      flag: 'r',
    })
  );

  return {
    coreTokensPath: path.join(tokensDirPath, 'core.json'),
    themeTokensPaths: themes.map(theme => {
      return path.join(tokensDirPath, `${themeName(theme)}.json`);
    }),
  };
}

async function copyToTempDir(tokensPath: string) {
  fse.copySync(tokensPath, tempTokensDirPath(), {overwrite: true});
}

async function splitTokensFile(tokensPath: string) {
  const tokensFile = await readFile(tokensPath, {encoding: 'utf-8', flag: 'r'});
  const tokens = JSON.parse(tokensFile);

  const core = tokens['core'];
  const themesList: Theme[] = tokens['$themes'];

  await writeJson('core', core);
  await writeJson('$themes', themesList);

  for (const theme of themesList) {
    const name = themeName(theme);
    const themeData = tokens[name];

    await writeJson(name, themeData);
  }
}

async function writeJson(fileName: string, content: any) {
  const filePath = path.join(tempTokensDirPath(), `${fileName}.json`);
  const dirPath = path.dirname(filePath);

  if (!existsSync(dirPath)) {
    await mkdir(dirPath, {recursive: true});
  }

  await writeFile(filePath, JSON.stringify(content));
}

function hasSingleTokensFile(tokensPath: string): boolean {
  return tokensPath.endsWith('.json');
}

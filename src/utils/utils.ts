import {readdir} from 'node:fs/promises';
import * as path from 'path';
import {lstatSync} from 'fs';

export function equalsCheck(a: any[], b: any[]): Boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export async function getAllFilesInDir(
  inputPath: string,
  arrayOfFiles: string[] = []
): Promise<string[]> {
  let filePaths: string[] = arrayOfFiles || [];
  const files = await readdir(inputPath);

  for (const filePath of files) {
    const fullFilePath = path.join(inputPath, filePath);
    if (lstatSync(fullFilePath).isDirectory()) {
      filePaths = await getAllFilesInDir(fullFilePath, filePaths);
    } else {
      filePaths.push(fullFilePath);
    }
  }
  return filePaths.filter(
    file =>
      file.endsWith('.json') &&
      !file.includes('$themes.json') &&
      !file.includes('$metadata.json')
  );
}

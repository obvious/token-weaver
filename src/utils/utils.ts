import * as path from 'path';
import {readFileSync} from 'fs';
import Handlebars = require('handlebars');

export function equalsCheck(a: any[], b: any[]): Boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function compileTemplate(templatePath: string) {
  return Handlebars.compile(
    readFileSync(path.join(__dirname, '..' + templatePath), {
      encoding: 'utf-8',
    })
  );
}

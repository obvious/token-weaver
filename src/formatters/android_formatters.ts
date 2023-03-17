import {camelCase} from 'camel-case';
import {FormatterArguments} from 'style-dictionary/types/Format';
import {_themeColorTokens, _themeTypographyTokens} from './common';
import {File, TransformedToken} from 'style-dictionary';
import {snakeCase} from 'snake-case';
import {capitalCase} from 'capital-case';
import * as StyleDictionary from 'style-dictionary';

const {fileHeader} = StyleDictionary.formatHelpers;

function xmlFileHeader(file: File): string {
  return fileHeader({
    file: file,
    commentStyle: 'xml',
  });
}

function _themeTokenFormat(themeTokenType: string): string {
  let themeTokenFormat: string;
  switch (themeTokenType) {
    case 'color':
      themeTokenFormat = 'color';
      break;
    case 'typography':
      themeTokenFormat = 'reference';
      break;
    default:
      throw new Error(
        `Unknown token type detected: ${themeTokenType}, please report this to Obvious to add support`
      );
  }

  return themeTokenFormat;
}

export function androidThemeFormat(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const themeColorItems = themeColorTokens
    .map(themeToken => {
      const themeColorTokenName = camelCase('color_' + themeToken.name);

      const colorRefName = snakeCase(
        themeToken.original.value.replace(/[{}]/g, '')
      );

      return (
        '    ' +
        `<item name="${themeColorTokenName}">@color/${colorRefName}</item>`
      );
    })
    .join('\n');

  const themeTypographyTokens = _themeTypographyTokens(args.dictionary);
  const themeTypographyItems = themeTypographyTokens.map(themeToken => {
    const themeTypographyTokenName = camelCase('typography_' + themeToken.name);

    const typographyRef =
      `TextAppearance.${args.options.projectName}.` +
      capitalCase(
        themeToken.original.value
          .replace(/[{}]/g, '')
          .replace('typography.', '')
      );

    return (
      '    ' +
      `<item name="${themeTypographyTokenName}">@style/${typographyRef}</item>`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>

${xmlFileHeader(args.file)}
<resources>

  <style name="Theme.${args.options.projectName}.${
    args.file.className
  }" parent="">
${themeColorItems}
${themeTypographyItems}
  </style>
</resources>
`;
}

export function androidThemeAttrsFormat(args: FormatterArguments) {
  let themeTokens: TransformedToken[];

  switch (args.options.attrsType) {
    case 'color':
      themeTokens = _themeColorTokens(args.dictionary);
      break;
    case 'typography':
      themeTokens = _themeTypographyTokens(args.dictionary);
      break;
    default:
      throw new Error(`Unknown attrs type: ${args.options.type}`);
  }

  const themeItems = themeTokens
    .map(themeToken => {
      const themeTokenType = themeToken.original.type;
      const themeTokenName = camelCase(`${themeTokenType}_` + themeToken.name);

      const themeTokenFormat = _themeTokenFormat(themeTokenType);

      return `  <attr name="${themeTokenName}" format="${themeTokenFormat}"/>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>

${xmlFileHeader(args.file)}
<resources>
${themeItems}
</resources>
`;
}

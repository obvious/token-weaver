import {camelCase} from 'camel-case';
import {equalsCheck} from '../utils/utils';
import {FormatterArguments} from 'style-dictionary/types/Format';
import {
  _colorTokens,
  _themeColorTokens,
  _themeTypographyTokens,
} from './common';
import {TransformedToken} from 'style-dictionary';

function _themeTokenName(themeToken: string, category: string): string {
  return camelCase(themeToken.replace(`${category}_`, ''));
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
  const colorTokens = _colorTokens(args.dictionary);

  console.log(colorTokens);
  // TODO: Handle typography tokens
  const colorThemeItems = themeColorTokens
    .filter(themeToken => {
      return (
        themeToken.original.type === 'color' &&
        !themeToken.original.value.startsWith('linear-gradient')
      );
    })
    .map(themeToken => {
      const colorValue = colorTokens.filter(colorToken => {
        const themeColorPath = themeToken.original.value
          .replace(/[{}']+/g, '')
          .split('.');
        return equalsCheck(colorToken.path, themeColorPath);
      })[0];

      const themeColorTokenName = _themeTokenName(
        'color_' + themeToken.name,
        themeToken.attributes?.category as string
      );

      return (
        '    ' +
        `<item name="${themeColorTokenName}">@color/${colorValue.name}</item>`
      );
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>

<!-- Do not edit directly -->
<resources>

  <style name="Base.Theme.Dls" parent="Theme.MaterialComponents.DayNight.NoActionBar">
${colorThemeItems}
  </style>
</resources>
`;
}

export function androidThemeAttrsFormat(args: FormatterArguments) {
  let themeTokens: TransformedToken[];
  let themeAttrsStyleableName: string;

  switch (args.options.type) {
    case 'color':
      themeTokens = _themeColorTokens(args.dictionary);
      themeAttrsStyleableName = 'DlsTheme';
      break;
    case 'typography':
      themeTokens = _themeTypographyTokens(args.dictionary);
      themeAttrsStyleableName = 'DlsTypography';
      break;
    default:
      throw new Error(`Unknown attrs type: ${args.options.type}`);
  }

  const themeItems = themeTokens
    .map(themeToken => {
      const themeTokenType = themeToken.original.type;
      const themeTokenName = _themeTokenName(
        `${themeTokenType}_` + themeToken.name,
        themeToken.attributes?.category as string
      );

      const themeTokenFormat = _themeTokenFormat(themeTokenType);

      return (
        '    ' + `<attr name="${themeTokenName}" format="${themeTokenFormat}"/>`
      );
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>

<!-- Do not edit directly -->
<resources>

  <declare-styleable name="${themeAttrsStyleableName}">
${themeItems}
  </declare-styleable>
</resources>
`;
}

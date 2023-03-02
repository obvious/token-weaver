import {Dictionary, TransformedToken} from 'style-dictionary';
import {camelCase} from 'camel-case';
import {equalsCheck} from '../utils/utils';
import {FormatterArguments} from 'style-dictionary/types/Format';

function _themeColorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('theme') && token.original.type === 'color';
  });
}

function _colorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('color');
  });
}

function _themeTokenName(themeToken: string, category: string): string {
  return camelCase(themeToken.replace(`${category}_`, ''));
}

export function androidThemeFormat(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const colorTokens = _colorTokens(args.dictionary);

  // TODO: Handle typography tokens
  const colorThemeItems = themeColorTokens
    .filter(themeToken => {
      return themeToken.original.type === 'color';
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

  <style name="Base.Theme.Dls" parent="">
${colorThemeItems}
  </style>
</resources>
`;
}

export function androidThemeAttrsFormat(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);

  const themeItems = themeColorTokens
    .map(themeToken => {
      const themeTokenType = themeToken.original.type;
      const themeTokenName = _themeTokenName(
        `${themeTokenType}_` + themeToken.name,
        themeToken.attributes?.category as string
      );

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

      return (
        '    ' + `<attr name="${themeTokenName}" format="${themeTokenFormat}"/>`
      );
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>

<!-- Do not edit directly -->
<resources>

  <declare-styleable name="DlsThemeColors">
${themeItems}
  </declare-styleable>
</resources>
`;
}

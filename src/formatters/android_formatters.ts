import {Dictionary, TransformedToken} from 'style-dictionary';
import {camelCase} from 'camel-case';
import {equalsCheck} from '../utils/utils';

function _themeTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('theme');
  });
}

function _colorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('color');
  });
}

function _themeTokenName(themeToken: String, category: String): String {
  return camelCase(themeToken.replace(`${category}_`, ''));
}

export function androidThemeFormat(dictionary: Dictionary): String {
  const themeTokens = _themeTokens(dictionary);
  const colorTokens = _colorTokens(dictionary);

  // TODO: Handle typography tokens
  const colorThemeItems = themeTokens
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
        themeToken.attributes?.category as String
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

export function androidThemeAttrsFormat(dictionary: Dictionary): String {
  const themeTokens = _themeTokens(dictionary);

  const themeItems = themeTokens
    .filter(themeToken => {
      // TODO: Remove this once decent coverage of token types is achieved
      return (
        themeToken.original.type === 'color' ||
        themeToken.original.type === 'typography'
      );
    })
    .map(themeToken => {
      const themeTokenType = themeToken.original.type;
      const themeTokenName = _themeTokenName(
        `${themeTokenType}_` + themeToken.name,
        themeToken.attributes?.category as String
      );

      let themeTokenFormat: String;

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

  <declare-styleable name="DlsTheme">
${themeItems}
  </declare-styleable>
</resources>
`;
}

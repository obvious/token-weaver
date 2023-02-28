import {Dictionary, TransformedToken} from 'style-dictionary';
import {FormatterArguments} from 'style-dictionary/types/Format';

function _colorThemeTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('theme') && token.original.type === 'color';
  });
}

function _colorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('color');
  });
}

export function iOSBaseColorsFormatter(args: FormatterArguments) {
  const colorTokens = _colorTokens(args.dictionary);
  const colorTokensCase = colorTokens
    .map(token => {
      return '   ' + `case ${token.name}`;
    })
    .join('\n');

  const colorTokensWithHexCode = colorTokens
    .map(token => {
      return (
        '    ' +
        `case .${token.name}:\n       return UIColor(rgbHex: "${token.value}")`
      );
    })
    .join('\n');

  return `import UIKit

// Do not edit directly
// Represet all colors supported by the DLS
public enum BaseColor {

${colorTokensCase}

  public var uiColor: UIColor {
    switch self {
${colorTokensWithHexCode}
    }
  }

  public var cgColor: CGColor {
    uiColor.cgColor
  }
}
`;
}

export function iOSThemeColorsProtocolFormatter(args: FormatterArguments) {
  const colorThemeTokens = _colorThemeTokens(args.dictionary);
  const themeColors = colorThemeTokens
    .map(token => {
      return '   ' + `var ${token.name}: BaseColor { get }`;
    })
    .join('\n');

  return `// Do not edit directly
public protocol ThemeColors {

${themeColors}
}
`;
}

// TODO: Add support for typography
export function iOSThemeProtocolFormatter() {
  return `// Do not edit directly
public protocol Theme {
  var colors: ThemeColors { get }
}
`;
}

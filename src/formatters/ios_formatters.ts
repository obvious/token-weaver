import {FormatterArguments} from 'style-dictionary/types/Format';
import {_colorTokens, _themeColorTokens} from './common';

function _swiftImports(imports: string[] | undefined): string {
  if (typeof imports === 'undefined') {
    imports = ['UIKit'];
  }

  return imports
    .map(value => {
      return `import ${value}`;
    })
    .join('\n');
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

  const imports = _swiftImports(args.options.imports);
  return `${imports}

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
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const themeColors = themeColorTokens
    .map(token => {
      return '   ' + `var ${token.name}: BaseColor { get }`;
    })
    .join('\n');

  const imports = _swiftImports(args.options.imports);
  return `${imports}

// Do not edit directly
public protocol ThemeColors {

${themeColors}
}
`;
}

// TODO: Add support for typography
export function iOSThemeProtocolFormatter(args: FormatterArguments) {
  const imports = _swiftImports(args.options.imports);
  return `${imports}

// Do not edit directly
public protocol Theme {
  var colors: ThemeColors { get }
}
`;
}

import {FormatterArguments} from 'style-dictionary/types/Format';
import {_themeColorTokens} from './common';
import {File} from 'style-dictionary';
import * as StyleDictionary from 'style-dictionary';
import camelCase from 'camelcase';

const {fileHeader} = StyleDictionary.formatHelpers;

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

function swiftFileHeader(file: File): string {
  return fileHeader({
    file: file,
    commentStyle: 'short',
  });
}

export function iOSBaseColorsFormatter(args: FormatterArguments) {
  const colorTokens = args.dictionary.allTokens;
  const colorTokensCase = colorTokens
    .map(token => {
      return '   ' + `case ${token.name}`;
    })
    .join('\n');

  const colorTokensWithHexCode = colorTokens
    .map(token => {
      return '    ' + `case .${token.name}:\n       return ${token.value}`;
    })
    .join('\n');

  const imports = _swiftImports(args.options.imports);
  return `${imports}

${swiftFileHeader(args.file)}
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
      return '   ' + `public var ${token.name}: BaseColor { get }`;
    })
    .join('\n');

  const imports = _swiftImports(args.options.imports);
  return `${imports}

${swiftFileHeader(args.file)}
public protocol ThemeColors {

${themeColors}
}
`;
}

// TODO: Add support for typography
export function iOSThemeProtocolFormatter(args: FormatterArguments) {
  const imports = _swiftImports(args.options.imports);
  return `${imports}

${swiftFileHeader(args.file)}
public protocol Theme {
  public var colors: ThemeColors { get }
}
`;
}

export function iOSThemeColorsFormatter(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const themeColorItems = themeColorTokens
    .map(themeToken => {
      const originalColorRef = themeToken.original.value.replace(/[{}]/g, '');
      const colorRefName = camelCase(originalColorRef);

      return (
        '   ' + `public var ${themeToken.name}: BaseColor = .${colorRefName}`
      );
    })
    .join('\n');

  const imports = _swiftImports(args.options.imports);
  return `${imports}

${swiftFileHeader(args.file)}
public class ${args.file.className} : ${args.options.implements} {
${themeColorItems}
}
`;
}

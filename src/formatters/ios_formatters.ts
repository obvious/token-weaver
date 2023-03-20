import {FormatterArguments} from 'style-dictionary/types/Format';
import {_themeColorTokens} from './common';
import {File} from 'style-dictionary';
import * as StyleDictionary from 'style-dictionary';
import camelCase from 'camelcase';
import {compileTemplate} from '../utils/utils';
import Handlebars = require('handlebars');

const {fileHeader} = StyleDictionary.formatHelpers;

function swiftImports(imports: string[] | undefined): string {
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
  const template = compileTemplate('/templates/ios/base_colors.hbs');

  return template({
    imports: swiftImports(args.options.imports),
    header: swiftFileHeader(args.file),
    color_tokens: args.dictionary.allTokens,
  });
}

export function iOSThemeColorsProtocolFormatter(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const template = compileTemplate('/templates/ios/theme_colors_protocol.hbs');

  return template({
    imports: swiftImports(args.options.imports),
    header: swiftFileHeader(args.file),
    color_tokens: themeColorTokens,
  });
}

// TODO: Add support for typography
export function iOSThemeProtocolFormatter(args: FormatterArguments) {
  const template = compileTemplate('/templates/ios/theme_protocol.hbs');

  return template({
    imports: swiftImports(args.options.imports),
    header: swiftFileHeader(args.file),
  });
}

export function iOSThemeColorsFormatter(args: FormatterArguments) {
  Handlebars.registerHelper('colorRefName', originalTokenValue => {
    const originalColorRef = originalTokenValue.toString().replace(/[{}]/g, '');
    return camelCase(originalColorRef);
  });

  const themeColorTokens = _themeColorTokens(args.dictionary);
  const template = compileTemplate('/templates/ios/theme_colors.hbs');

  return template({
    imports: swiftImports(args.options.imports),
    header: swiftFileHeader(args.file),
    color_tokens: themeColorTokens,
    class_name: args.file.className,
  });
}

// TODO: Add support for typography
export function iOSThemeFormatter(args: FormatterArguments) {
  const template = compileTemplate('/templates/ios/theme.hbs');

  return template({
    imports: swiftImports(args.options.imports),
    header: swiftFileHeader(args.file),
    class_name: args.file.className,
    theme_colors_class: args.options.themeColorsClass,
  });
}

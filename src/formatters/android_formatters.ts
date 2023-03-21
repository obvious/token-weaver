import {camelCase} from 'camel-case';
import {FormatterArguments} from 'style-dictionary/types/Format';
import {_themeColorTokens, _themeTypographyTokens} from './common';
import {File, TransformedToken} from 'style-dictionary';
import {snakeCase} from 'snake-case';
import {capitalCase} from 'capital-case';
import * as StyleDictionary from 'style-dictionary';
import {compileTemplate} from '../utils/utils';
import Handlebars = require('handlebars');

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

export function androidTypographyFormatter(args: FormatterArguments) {
  const template = compileTemplate('templates/android/android_typography.hbs');

  return template({
    header: xmlFileHeader(args.file),
    class_name: args.file.className,
    text_styles: args.dictionary.allTokens,
  });
}

export function androidThemeFormatter(args: FormatterArguments) {
  const themeColorTokens = _themeColorTokens(args.dictionary);
  const themeTypographyTokens = _themeTypographyTokens(args.dictionary);

  const template = compileTemplate('templates/android/android_theme.hbs');

  Handlebars.registerHelper('colorTokenName', tokenName => {
    return camelCase('color_' + tokenName);
  });

  Handlebars.registerHelper('colorRefName', originalTokenValue => {
    return snakeCase(originalTokenValue.replace(/[{}]/g, ''));
  });

  Handlebars.registerHelper('typographyTokenName', tokenName => {
    return camelCase('typography_' + tokenName);
  });

  Handlebars.registerHelper('typographyRefName', originalTokenValue => {
    return capitalCase(
      originalTokenValue.replace(/[{}]/g, '').replace('typography.', '')
    );
  });

  return template({
    header: xmlFileHeader(args.file),
    project_name: args.options.projectName,
    theme_name: args.file.className,
    parent_theme: '',
    color_tokens: themeColorTokens,
    typography_tokens: themeTypographyTokens,
  });
}

export function androidThemeAttrsFormatter(args: FormatterArguments) {
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

  const template = compileTemplate('templates/android/android_theme_attrs.hbs');

  Handlebars.registerHelper('attrName', (tokenType, tokenName) => {
    return camelCase(`${tokenType}_` + tokenName);
  });

  Handlebars.registerHelper('attrFormat', tokenType => {
    return _themeTokenFormat(tokenType);
  });

  return template({
    header: xmlFileHeader(args.file),
    theme_tokens: themeTokens,
  });
}

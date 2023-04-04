import {Config} from 'style-dictionary';
import {capitalCase} from 'capital-case';

export function coreTokensConfig(
  tokensPath: string[],
  outputPath: string,
  projectName: string
): Config {
  return {
    source: tokensPath,
    platforms: {
      'core/android': {
        transforms: [
          'attribute/cti',
          'name/cti/snake',
          'color/hex8android',
          'size/remToSp',
          'size/remToDp',
          'weaver/typography/xml',
        ],
        buildPath: `${outputPath}/android/`,
        files: [
          {
            destination: 'res/colors.xml',
            format: 'android/resources',
            filter: {
              attributes: {
                category: 'color',
              },
            },
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'res/typography.xml',
            format: 'android/text_appearance',
            className: projectName,
            filter: {
              attributes: {
                category: 'typography',
              },
            },
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'res/theme_attrs.xml',
            format: 'android/attrs',
            className: 'ThemeAttrs',
            filter: token => token.type === 'color',
            options: {
              attrsType: 'color',
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'res/theme_typography_attrs.xml',
            format: 'android/attrs',
            className: 'TypographyAttrs',
            filter: token => token.type === 'typography',
            options: {
              attrsType: 'typography',
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
      'core/ios': {
        transforms: ['attribute/cti', 'name/cti/camel', 'color/UIColorSwift'],
        buildPath: `${outputPath}/ios/`,
        files: [
          {
            destination: 'BaseColor.swift',
            format: 'ios/base_colors',
            filter: {
              attributes: {
                category: 'color',
              },
            },
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'ThemeColors.swift',
            format: 'ios/theme_colors_protocol',
            filter: token => token.type === 'color',
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'TextStyle.swift',
            format: 'ios/text_style',
            filter: token => token.type === 'typography',
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'Theme.swift',
            format: 'ios/theme_protocol',
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
    },
  };
}

export function themesConfig(
  tokensPath: string[],
  outputPath: string,
  themeName: string,
  projectName: string
): Config {
  const formattedThemeName = capitalCase(themeName);
  return {
    source: tokensPath,
    platforms: {
      'theme/android': {
        transformGroup: 'android',
        buildPath: `${outputPath}/android/`,
        files: [
          {
            destination: `res/${themeName}_theme.xml`,
            format: 'android/theme',
            filter: token =>
              token.type === 'color' || token.type === 'typography',
            className: `${formattedThemeName}`,
            options: {
              projectName: projectName,
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
      'theme/ios': {
        transforms: ['attribute/cti', 'name/cti/camel'],
        buildPath: `${outputPath}/ios/`,
        files: [
          {
            destination: `${formattedThemeName}ThemeColors.swift`,
            format: 'ios/theme_colors',
            filter: token => token.type === 'color',
            className: `${formattedThemeName}ThemeColors`,
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: `${formattedThemeName}Theme.swift`,
            format: 'ios/theme',
            className: `${formattedThemeName}Theme`,
            options: {
              themeColorsClass: `${formattedThemeName}ThemeColors`,
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
    },
  };
}

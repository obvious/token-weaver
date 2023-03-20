import {Config} from 'style-dictionary';
import {capitalCase} from 'capital-case';

export function coreTokensConfig(
  tokensPath: string[],
  outputPath: string
): Config {
  return {
    source: tokensPath,
    platforms: {
      android: {
        transforms: [
          'attribute/cti',
          'name/cti/snake',
          'color/hex8android',
          'size/remToSp',
          'size/remToDp',
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
            destination: 'res/theme_attrs.xml',
            format: 'androidThemeAttrsFormat',
            className: 'ThemeAttrs',
            filter: token => token.type === 'color',
            options: {
              attrsType: 'color',
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'res/theme_typography_attrs.xml',
            format: 'androidThemeAttrsFormat',
            className: 'TypographyAttrs',
            filter: token => token.type === 'typography',
            options: {
              attrsType: 'typography',
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
      ios: {
        transforms: ['attribute/cti', 'name/cti/camel', 'color/UIColorSwift'],
        buildPath: `${outputPath}/ios/`,
        files: [
          {
            destination: 'BaseColor.swift',
            format: 'iOSBaseColorsFormatter',
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
            format: 'iOSThemeColorsProtocolFormatter',
            filter: token => token.type === 'color',
            options: {
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: 'Theme.swift',
            format: 'iOSThemeProtocolFormatter',
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
      android: {
        transformGroup: 'android',
        buildPath: `${outputPath}/android/`,
        files: [
          {
            destination: `res/${themeName}_theme.xml`,
            format: 'androidThemeFormat',
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
      ios: {
        transforms: ['attribute/cti', 'name/cti/camel'],
        buildPath: `${outputPath}/ios/`,
        files: [
          {
            destination: `${formattedThemeName}ThemeColors.swift`,
            format: 'iOSThemeColorsFormatter',
            filter: token => token.type === 'color',
            className: `${formattedThemeName}ThemeColors`,
            options: {
              implements: 'ThemeColors',
              fileHeader: 'weaverFileHeader',
            },
          },
          {
            destination: `${formattedThemeName}Theme.swift`,
            format: 'iOSThemeFormatter',
            className: `${formattedThemeName}Theme`,
            options: {
              implements: 'Theme',
              themeColorsClass: `${formattedThemeName}ThemeColors`,
              fileHeader: 'weaverFileHeader',
            },
          },
        ],
      },
    },
  };
}

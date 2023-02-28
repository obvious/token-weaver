import {
  androidThemeFormat,
  androidThemeAttrsFormat,
} from './formatters/android_formatters';
import {
  iOSBaseColorsFormatter,
  iOSThemeColorsProtocolFormatter,
  iOSThemeProtocolFormatter,
} from './formatters/ios_formatters';

export = {
  source: ['tokens/sd_tokens.json'],
  format: {
    androidThemeFormat: androidThemeFormat,
    androidThemeAttrsFormat: androidThemeAttrsFormat,
    iOSBaseColorsFormatter: iOSBaseColorsFormatter,
    iOSThemeColorsProtocolFormatter: iOSThemeColorsProtocolFormatter,
    iOSThemeProtocolFormatter: iOSThemeProtocolFormatter,
  },
  platforms: {
    android: {
      transformGroup: 'android',
      buildPath: 'output/android/',
      files: [
        {
          destination: 'res/colors.xml',
          format: 'android/colors',
        },
        {
          destination: 'res/base_theme.xml',
          format: 'androidThemeFormat',
        },
        {
          destination: 'res/theme_attrs.xml',
          format: 'androidThemeAttrsFormat',
        },
      ],
    },
    ios: {
      transforms: ['name/ti/camel', 'color/hex'],
      buildPath: 'output/ios/',
      files: [
        {
          destination: 'BaseColor.swift',
          format: 'iOSBaseColorsFormatter',
        },
        {
          destination: 'ThemeColors.swift',
          format: 'iOSThemeColorsProtocolFormatter',
        },
        {
          destination: 'Theme.swift',
          format: 'iOSThemeProtocolFormatter',
        },
      ],
    },
  },
};

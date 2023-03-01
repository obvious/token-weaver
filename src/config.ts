import {Config} from 'style-dictionary';
import {
  androidThemeFormat,
  androidThemeAttrsFormat,
} from './formatters/android_formatters';
import {
  iOSBaseColorsFormatter,
  iOSThemeColorsProtocolFormatter,
  iOSThemeProtocolFormatter,
} from './formatters/ios_formatters';

export function config(tokensPath: String, outputPath: String): Config {
  return {
    source: [tokensPath.toString()],
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
        buildPath: `${outputPath}/android/`,
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
        buildPath: `${outputPath}/iOS/`,
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
}

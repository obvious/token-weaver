import {
  androidThemeFormat,
  androidThemeAttrsFormat,
} from './formatters/android_formatters';

export = {
  source: ['tokens/sd_tokens.json'],
  format: {
    androidThemeFormat: androidThemeFormat,
    androidThemeAttrsFormat: androidThemeAttrsFormat,
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
  },
};

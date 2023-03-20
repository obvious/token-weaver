import {capitalCase} from 'capital-case';

// TODO: Handle percentage based letter spacing
function formatValue(value: string, propName: string): string {
  let val: string;
  switch (propName) {
    case 'lineHeight':
    case 'android:textSize':
      val = parseFloat(value).toFixed(2) + 'sp';
      break;
    default:
      val = value;
  }

  return val;
}

function textStyleItem(textStyleProperty: string, value: string): string {
  return `  <item name="${textStyleProperty}">${formatValue(
    value,
    textStyleProperty
  )}</item>\n`;
}

export function transformTypographyForXml(
  projectName: string,
  name: string,
  value: Record<string, string> | undefined
): string | undefined {
  if (value === undefined) {
    return value;
  }

  const textAppearanceName = capitalCase(name.replace('typography_', ''));

  const textStylePropertiesMapping = new Map<string, string>([
    ['lineHeight', 'lineHeight'],
    ['fontSize', 'android:textSize'],
    ['letterSpacing', 'android:letterSpacing'],
  ]);

  /**
   * Constructs a text appearance XML, e.g.
   * <style name="TextAppearance.App.Heading1">
   *    <item name="android:textSize">24sp</item>
   * </style>
   */
  return `${Object.entries(value).reduce((acc, [propName, val]) => {
    const textStyleProperty = textStylePropertiesMapping.get(propName);
    return `${acc}${
      textStyleProperty ? textStyleItem(textStyleProperty, val) : ''
    }`;
  }, `<style name="TextAppearance.${projectName}.${textAppearanceName}">\n`)}</style>\n`;
}

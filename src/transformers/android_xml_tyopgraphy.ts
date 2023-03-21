import {capitalCase} from 'capital-case';

function transformPercentValue(value: string, base: string): string {
  let val: string;
  if (value.endsWith('%')) {
    const valueInPx =
      (parseFloat(value.replace('%', '')) / 100) * parseFloat(base);
    val = valueInPx.toFixed(2);
  } else {
    val = value;
  }
  return val;
}

function formatValue(
  value: string,
  propName: string,
  fontSize: string
): string {
  let val: string;
  switch (propName) {
    case 'lineHeight':
      val = transformPercentValue(value, fontSize) + 'sp';
      break;
    case 'android:letterSpacing':
      val = transformPercentValue(value, fontSize);
      break;
    case 'android:textSize':
      val = parseFloat(value).toFixed(2) + 'sp';
      break;
    default:
      val = value;
  }

  return val;
}

function textStyleItem(
  textStyleProperty: string,
  value: string,
  fontSize: string
): string {
  return `    <item name="${textStyleProperty}">${formatValue(
    value,
    textStyleProperty,
    fontSize
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
      textStyleProperty
        ? textStyleItem(textStyleProperty, val, value.fontSize)
        : ''
    }`;
  }, `<style name="TextAppearance.${projectName}.${textAppearanceName}">\n`)}  </style>\n`;
}

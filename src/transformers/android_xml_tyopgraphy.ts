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

function transformValue(
  value: string,
  propName: string,
  fontSize: string
): string {
  let val: string;
  if (propName.includes('textSize')) {
    val = parseFloat(value).toFixed(2) + 'sp';
  } else if (propName.includes('lineHeight')) {
    val = transformPercentValue(value, fontSize) + 'sp';
  } else if (propName.includes('letterSpacing')) {
    val = transformPercentValue(value, fontSize);
  } else {
    val = value;
  }

  return val;
}

function textStyleItem(
  textStyleProperty: string,
  value: string,
  fontSize: string
): string {
  return `    <item name="${textStyleProperty}">${transformValue(
    value,
    textStyleProperty,
    fontSize
  )}</item>\n`;
}

function textStyle(
  textStyleProperty: string | undefined,
  value: string,
  fontSize: string
): string {
  if (textStyleProperty === undefined) {
    return '';
  }

  let styleItem: string;
  if (textStyleProperty.includes('lineHeight')) {
    // Assigning app:lineHeight and android:lineHeight incase `AppCompatTextView` is not used
    styleItem =
      textStyleItem('lineHeight', value, fontSize) +
      textStyleItem('android:lineHeight', value, fontSize);
  } else {
    styleItem = textStyleItem(textStyleProperty, value, fontSize);
  }

  return styleItem;
}

export function transformTypographyForXml(
  value: Record<string, string> | undefined
): string | undefined {
  if (value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    // input value doesn't contain the object which has typogrpahy information or it's already transformed
    return value;
  }

  const textStylePropertiesMapping = new Map<string, string>([
    ['lineHeight', 'lineHeight'],
    ['fontSize', 'android:textSize'],
    ['letterSpacing', 'android:letterSpacing'],
  ]);

  /**
   * Constructs a text appearance child items, e.g.
   *
   * <item name="android:textSize">24sp</item>
   *
   */
  const entries = Object.entries(value).map(([prop, val]) => {
    const textStyleProperty = textStylePropertiesMapping.get(prop);
    return textStyle(textStyleProperty, val, value.fontSize);
  });

  return entries.join('').trimEnd();
}

import {snakeCase} from 'snake-case';

// Uses common weight name mapping
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
function transformFontWeight(weight: string | number | undefined): string {
  if (weight === undefined) {
    return '';
  }

  if (typeof weight === 'string') {
    const fontWeightNum = parseInt(weight);
    if (!fontWeightNum) {
      return weight;
    }

    weight = fontWeightNum;
  }

  let weightRet: string;
  switch (weight) {
    case 100:
      weightRet = 'thin';
      break;
    case 200:
      weightRet = 'extra_light';
      break;
    case 300:
      weightRet = 'light';
      break;
    case 400:
      weightRet = 'normal';
      break;
    case 500:
      weightRet = 'medium';
      break;
    case 600:
      weightRet = 'semi_bold';
      break;
    case 700:
      weightRet = 'bold';
      break;
    case 800:
      weightRet = 'extra_bold';
      break;
    case 900:
      weightRet = 'black';
      break;
    default:
      weightRet = weight.toString(0);
      break;
  }

  return weightRet;
}

function transformFontFamily(
  name: string,
  weight: string | number | undefined
): string {
  let fontWeight = '';
  if (weight !== undefined) {
    fontWeight = transformFontWeight(weight);
  }

  return `@font/${snakeCase(name + ' ' + fontWeight)}`;
}

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
  tokenValue: Record<string, string>
): string {
  let val: string;
  if (propName.includes('textSize')) {
    val = parseFloat(value).toFixed(2) + 'sp';
  } else if (propName.includes('lineHeight')) {
    val = transformPercentValue(value, tokenValue.fontSize) + 'sp';
  } else if (propName.includes('letterSpacing')) {
    val = transformPercentValue(value, tokenValue.fontSize);
  } else if (propName.includes('fontFamily')) {
    val = transformFontFamily(value, tokenValue.fontWeight);
  } else {
    val = value;
  }

  return val;
}

function textStyleItem(
  textStyleProperty: string,
  value: string,
  tokenValue: Record<string, string>
): string {
  return `<item name="${textStyleProperty}">${transformValue(
    value,
    textStyleProperty,
    tokenValue
  )}</item>`;
}

function textStyle(
  textStyleProperty: string,
  value: string,
  tokenValue: Record<string, string>
): string[] {
  let styleItem: string[];
  if (textStyleProperty.includes('lineHeight')) {
    // Assigning app:lineHeight and android:lineHeight incase `AppCompatTextView` is not used
    styleItem = [
      textStyleItem('lineHeight', value, tokenValue),
      textStyleItem('android:lineHeight', value, tokenValue),
    ];
  } else if (textStyleProperty.includes('fontFamily')) {
    // Assigning app:fontFamily and android:fontFamily incase `AppCompatTextView` is not used
    styleItem = [
      textStyleItem('fontFamily', value, tokenValue),
      textStyleItem('android:fontFamily', value, tokenValue),
    ];
  } else {
    styleItem = [textStyleItem(textStyleProperty, value, tokenValue)];
  }

  return styleItem;
}

export function transformTypographyForXml(
  value: Record<string, string> | undefined
): string[] | undefined {
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
    ['fontFamily', 'fontFamily'],
  ]);

  /**
   * Constructs a text appearance child items, e.g.
   *
   * <item name="android:textSize">24sp</item>
   *
   */
  return Object.entries(value)
    .filter(([prop]) => textStylePropertiesMapping.get(prop))
    .flatMap(([prop, val]) => {
      const textStyleProperty = textStylePropertiesMapping.get(prop)!;
      return textStyle(textStyleProperty, val, value);
    });
}

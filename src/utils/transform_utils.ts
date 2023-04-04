export function transformPercentValue(value: string, base: string): string {
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

// Uses common weight name mapping
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
export function transformFontWeight(
  weight: string | number | undefined
): string {
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

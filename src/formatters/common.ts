import {Dictionary, TransformedToken} from 'style-dictionary';

function _themeColorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('theme') && token.original.type === 'color';
  });
}

function _themeTypographyTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('theme') && token.original.type === 'typography';
  });
}

function _colorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.path.includes('color');
  });
}

export {_themeColorTokens, _themeTypographyTokens, _colorTokens};

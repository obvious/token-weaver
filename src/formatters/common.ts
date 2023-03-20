import {Dictionary, TransformedToken} from 'style-dictionary';

function _themeColorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return (
      token.original.type === 'color' && token.attributes?.category !== 'color'
    );
  });
}

function _themeTypographyTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return (
      token.original.type === 'typography' &&
      token.attributes?.category !== 'typography'
    );
  });
}

function _colorTokens(dictionary: Dictionary): TransformedToken[] {
  return dictionary.allTokens.filter(token => {
    return token.attributes?.category === 'color';
  });
}

export {_themeColorTokens, _themeTypographyTokens, _colorTokens};

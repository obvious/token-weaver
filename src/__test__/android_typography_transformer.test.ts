import {transformTypographyForXml} from '../transformers/android_xml_tyopgraphy';

describe('transform typography', () => {
  it('transforms typography object to typography shorthand', () => {
    const xml = transformTypographyForXml({
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.8',
    });

    expect(xml).toMatchSnapshot();
  });

  it('transforms ignores unknown properties in typography object', () => {
    const xml = transformTypographyForXml({
      fontSize: '20px',
      lineHeight: '24px',
      textDecoration: 'underline',
    });

    expect(xml).toMatchSnapshot();
  });
});

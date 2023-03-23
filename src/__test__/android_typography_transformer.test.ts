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

  describe('transforms typography object with font details to include font ref', () => {
    it('with font family and weight name', () => {
      const xml = transformTypographyForXml({
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.8',
        fontFamily: 'Roboto',
        fontWeight: 'Medium Italic',
      });

      expect(xml).toMatchSnapshot();
    });

    it('with font family and weight value', () => {
      const xml = transformTypographyForXml({
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.8',
        fontFamily: 'Rubik',
        fontWeight: '600',
      });

      expect(xml).toMatchSnapshot();
    });
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

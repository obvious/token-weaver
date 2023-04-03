import {readTokens, tempTokensDirPath} from '../reader/tokens_reader';
import {rm} from 'fs/promises';
import * as path from 'path';

describe('read tokens', () => {
  it('should read tokens from a single file', async () => {
    // given
    const tokensPath = path.join(
      __dirname,
      '../..',
      'sample_tokens',
      'tokens.json'
    );

    // when
    const result = await readTokens(tokensPath);

    // then
    expect(result).toMatchSnapshot();
  });

  it('should read tokens from multiple files', async () => {
    // given
    const tokensPath = path.join(__dirname, '../..', 'sample_tokens');

    // when
    const result = await readTokens(tokensPath);

    // then
    expect(result).toMatchSnapshot();
  });

  afterAll(async () => {
    await rm(tempTokensDirPath(), {recursive: true});
  });
});

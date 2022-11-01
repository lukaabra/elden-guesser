import { sortParamSatisfiesFormat, parseSortParam } from './queryParamUtils';

describe('queryParamUtils', () => {
  it('sort query string should satisfy sort format', async () => {
    const queryString = 'lastName(asc),email(desc)';
    const result = sortParamSatisfiesFormat(queryString);

    expect(result).toBe(true);
  });

  it('random string should not satisfy sort format', async () => {
    const queryString = 'somekindofrandomstring#@!%';
    const result = sortParamSatisfiesFormat(queryString);

    expect(result).toBe(false);
  });

  it('empty string should not satisfy sort format', async () => {
    const queryString = '';
    const result = sortParamSatisfiesFormat(queryString);

    expect(result).toBe(false);
  });

  it('sort query string parsed successfully', async () => {
    const queryString = 'lastName(asc),email(desc)';
    const parsedQueryString = parseSortParam(queryString);

    expect(parsedQueryString).toBeInstanceOf(Array);
    expect(parsedQueryString.length).toEqual(2);
    expect(parsedQueryString[0]).toHaveProperty('lastName', 'asc');
    expect(parsedQueryString[1]).toHaveProperty('email', 'desc');
  });

  it('sort query string returns empty array', async () => {
    const queryString = 'somekindofrandomstring#@!%';
    const parsedQueryString = parseSortParam(queryString);

    expect(parsedQueryString).toBeInstanceOf(Array);
    expect(parsedQueryString.length).toEqual(0);
  });
});

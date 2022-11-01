import {
  sortParamSatisfiesFormat,
  parseSortParam,
  parseFilterParam,
} from './queryParamUtils';

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

  it('filter query string with 1 filter parsed successfully', async () => {
    const queryString = 'id[equals]"1"';
    const parsedQueryString = parseFilterParam(queryString);

    expect(parsedQueryString).toHaveProperty('id', { equals: 1 });
  });

  it('filter query string with 2 filters parsed successfully', async () => {
    const queryString = 'id[equals]"1"&lastName[contains]"test."';
    const parsedQueryString = parseFilterParam(queryString);

    expect(parsedQueryString).toHaveProperty('id', { equals: 1 });
    expect(parsedQueryString).toHaveProperty('lastName', {
      contains: 'test.',
      mode: 'insensitive',
    });
  });

  it('filter query string with 1 correct filter parsed successfully and 1 incorrect param ignored', async () => {
    const queryString = 'id[equals]"1"&blabla[blalba]<fdsa>';
    const parsedQueryString = parseFilterParam(queryString);

    expect(parsedQueryString).toHaveProperty('id', { equals: 1 });
    expect(parsedQueryString).not.toHaveProperty('blabla');
  });

  it('filter query containing double quotes in value ignores rest of query after second quote', async () => {
    const queryString = 'id[equals]"some"value"with"quotes"';
    const parsedQueryString = parseFilterParam(queryString);

    expect(parsedQueryString).toHaveProperty('id', { equals: 'some' });
  });

  it('incorrect filter query string returns empty object', async () => {
    const queryString = 'fjdksla;djksla;gjsdi;i4jg439';
    const parsedQueryString = parseFilterParam(queryString);

    expect(Object.keys(parsedQueryString).length).toEqual(0);
  });
});

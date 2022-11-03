import {
  sortParamSatisfiesFormat,
  parseSortParam,
  parseFilterParam,
  parseQueryParams,
} from './queryParamUtils';
import { DEFAULT_LIMIT } from '../constants';

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

  it('parses query params correctly', async () => {
    const limit = '100';
    const page = '2';
    const sort = 'sort=lastName(asc),email(desc)';
    const filter = 'filter=id[equals]"1"&lastName[contains]"test"';

    const parsedQueryParams = parseQueryParams(limit, page, sort, filter);

    expect(parsedQueryParams).toHaveProperty('take', 100);
    expect(parsedQueryParams).toHaveProperty('skip', 100);
    expect(parsedQueryParams).toHaveProperty('orderBy', [
      {
        lastName: 'asc',
      },
      {
        email: 'desc',
      },
    ]);
    expect(parsedQueryParams).toHaveProperty('where', {
      id: { equals: 1 },
      lastName: { contains: 'test', mode: 'insensitive' },
    });
  });

  it('returns default query params', async () => {
    const parsedQueryParams = parseQueryParams();

    expect(parsedQueryParams).toHaveProperty('take', DEFAULT_LIMIT);
    expect(parsedQueryParams).not.toHaveProperty('skip');
    expect(parsedQueryParams).not.toHaveProperty('orderBy');
    expect(parsedQueryParams).not.toHaveProperty('where');
  });

  it('ignores incorrect limit and page', async () => {
    const nonNumericString = 'nonNumericString';
    const parsedQueryParams = parseQueryParams(
      nonNumericString,
      nonNumericString,
    );

    expect(parsedQueryParams).toHaveProperty('take', DEFAULT_LIMIT);
    expect(parsedQueryParams).not.toHaveProperty('skip');
    expect(parsedQueryParams).not.toHaveProperty('orderBy');
    expect(parsedQueryParams).not.toHaveProperty('where');
  });
});

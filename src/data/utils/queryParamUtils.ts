import { Prisma } from '@prisma/client';

import { DEFAULT_LIMIT } from '../constants';
import { QueryParams } from '../types/QueryParams';

export type SortObject = { [key: string]: Prisma.SortOrder }[];

export type FilterObject = {
  [key: string]: { [key: string]: string | number | Date };
};

export const sortParamSatisfiesFormat = (
  sortString: string | undefined,
): boolean => {
  if (!sortString) {
    return false;
  }

  const sortQueryStringRegex = /(\w+)\((asc|desc)\)/gu;

  return sortQueryStringRegex.test(sortString);
};

// Sort query parameter string example:
// sort=lastName(asc),email(desc)
export const parseSortParam = (sortString: string): SortObject => {
  const sortQueryStringRegex = /(\w+)\((asc|desc)\)/gu;
  const sortObject: SortObject = [];

  let match: RegExpExecArray;
  do {
    match = sortQueryStringRegex.exec(sortString);
    if (match) {
      const columnObject = {};

      const paramToSortOn = match[1];
      const order = match[2];

      columnObject[paramToSortOn] = order as Prisma.SortOrder;

      sortObject.push(columnObject);
    }
  } while (match);

  return sortObject;
};

// Filter query parameter string example:
// id[equals]"1"&lastName[contains]"test"
export const parseFilterParam = (filterString: string): FilterObject => {
  const stringOnlyOperations = ['contains', 'startsWith', 'endsWith'];
  const filterQueryStringRegex =
    /(\w+)\[(equals|in|notIn|lt|lte|gt|gte|contains|startsWith|endsWith|not)\]"(\w*\d*[,<.>/?;:'\[\{\]\}\\\|=+\-_)(*&^%$#@!`]*)"/gu;
  const filterObject: FilterObject = {};

  let match: RegExpExecArray;
  do {
    match = filterQueryStringRegex.exec(filterString);
    if (match) {
      const paramToFilter = match[1];
      const operation = match[2];
      const value = isNaN(Number(match[3])) ? match[3] : Number(match[3]);

      if (stringOnlyOperations.includes(operation)) {
        // Default string filter to be case insensitive
        filterObject[paramToFilter] = { mode: 'insensitive' };
      } else {
        filterObject[paramToFilter] = {};
      }

      filterObject[paramToFilter][operation] = value;
    }
  } while (match);

  return filterObject;
};

export const parseQueryParams = (
  limit?: string,
  page?: string,
  sort?: string,
  filter?: string,
): QueryParams => {
  const params: QueryParams = { take: DEFAULT_LIMIT };

  if (limit && !isNaN(parseInt(limit))) {
    params.take = parseInt(limit);
  }

  // page 1 = first 20 if limit is default
  if (page && !isNaN(parseInt(page))) {
    params.skip = params.take * (parseInt(page) - 1);
  }

  if (sortParamSatisfiesFormat(sort)) {
    params.orderBy = parseSortParam(sort);
  }

  if (filter) {
    params.where = parseFilterParam(filter);
  }

  return params;
};

import { Prisma } from '@prisma/client';

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

export const parseSortParam = (
  sortString: string,
): { [key: string]: Prisma.SortOrder }[] => {
  const sortQueryStringRegex = /(\w+)\((asc|desc)\)/gu;
  const sortObject: { [key: string]: Prisma.SortOrder }[] = [];

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

// Query filter example: id[equals]"1"&lastName[contains]"test"
export const parseFilterParam = (filterString: string): FilterObject => {
  const stringOnlyOperations = ['contains', 'startsWith', 'endsWith'];
  const filterQueryStringRegex =
    /(\w+)\[(equals|in|notIn|lt|lte|gt|gte|contains|startsWith|endsWith|not)\]"([\w|\d]+)"/gu;
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

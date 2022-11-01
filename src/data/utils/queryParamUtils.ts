import { Prisma } from '@prisma/client';

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

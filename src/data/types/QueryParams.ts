import { Prisma } from '@prisma/client';

export type QueryParams = {
  skip?: number;
  take?: number;
  orderBy?: { [key: string]: Prisma.SortOrder }[];
  where?: { [key: string]: { contains: string } };
};

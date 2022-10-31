import { User } from '@prisma/client';

export type UserNoPassword = Omit<User, 'password'>;

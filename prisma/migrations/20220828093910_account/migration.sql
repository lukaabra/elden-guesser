/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `AccountHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `AccountHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AccountHistory" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

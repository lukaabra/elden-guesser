/*
  Warnings:

  - You are about to drop the column `accountHistoryId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `areaId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `bearingId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `coordinatesId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `coordinatesId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bearing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coordinates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubmissionHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bearing` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_accountHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_bearingId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_accountHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_bearingId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_imageId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_accountHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_accountId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_areaId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_bearingId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionHistory" DROP CONSTRAINT "SubmissionHistory_imageId_fkey";

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "accountHistoryId",
DROP COLUMN "accountId",
DROP COLUMN "areaId",
DROP COLUMN "bearingId",
DROP COLUMN "coordinatesId",
DROP COLUMN "submissionId",
ADD COLUMN     "bearing" INTEGER NOT NULL,
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "coordinatesId",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AccountHistory";

-- DropTable
DROP TABLE "Bearing";

-- DropTable
DROP TABLE "Coordinates";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "SubmissionHistory";

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "winnerUserId" INTEGER,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameUser" (
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameUser_pkey" PRIMARY KEY ("gameId","userId")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "guessId" INTEGER,
    "score" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "leaderboardId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "areaId" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" SERIAL NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "bearing" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUser" ADD CONSTRAINT "GameUser_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameUser" ADD CONSTRAINT "GameUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_guessId_fkey" FOREIGN KEY ("guessId") REFERENCES "Guess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "Leaderboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

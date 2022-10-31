/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Round` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Target` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_winnerUserId_fkey";

-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_userId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_guessId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_targetId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_userId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_leaderboardId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_locationId_fkey";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "GameUser";

-- DropTable
DROP TABLE "Guess";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Leaderboard";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Round";

-- DropTable
DROP TABLE "Score";

-- DropTable
DROP TABLE "Target";

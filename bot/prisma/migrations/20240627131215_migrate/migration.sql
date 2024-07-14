/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LastfmUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `LastfmUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LastfmUser" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LastfmUser_userId_key" ON "LastfmUser"("userId");

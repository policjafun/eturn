/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "LastfmUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "library" JSONB[],
    "hideUsername" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LastfmUser_pkey" PRIMARY KEY ("id")
);

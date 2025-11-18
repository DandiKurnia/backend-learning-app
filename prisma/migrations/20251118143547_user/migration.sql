/*
  Warnings:

  - Changed the type of `user_role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_role",
ADD COLUMN     "user_role" INTEGER NOT NULL;

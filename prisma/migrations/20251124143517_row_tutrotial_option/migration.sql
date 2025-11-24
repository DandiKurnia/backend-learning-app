/*
  Warnings:

  - Added the required column `is_correct` to the `TutorialOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TutorialOption" ADD COLUMN     "is_correct" BOOLEAN NOT NULL;

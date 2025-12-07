/*
  Warnings:

  - You are about to drop the `ModelTraining` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModelTraining" DROP CONSTRAINT "ModelTraining_id_user_fkey";

-- DropTable
DROP TABLE "ModelTraining";

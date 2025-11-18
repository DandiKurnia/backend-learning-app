/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DeveloperJourney` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeveloperJourney_name_key" ON "DeveloperJourney"("name");

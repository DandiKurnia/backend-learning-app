-- CreateTable
CREATE TABLE "DeveloperJourneyTutorial" (
    "id" SERIAL NOT NULL,
    "developer_journey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "DeveloperJourneyTutorial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeveloperJourneyTutorial" ADD CONSTRAINT "DeveloperJourneyTutorial_developer_journey_id_fkey" FOREIGN KEY ("developer_journey_id") REFERENCES "DeveloperJourney"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperJourneyTutorial" ADD CONSTRAINT "DeveloperJourneyTutorial_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

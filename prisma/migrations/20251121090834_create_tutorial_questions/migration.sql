-- CreateTable
CREATE TABLE "DeveloperJourneyTutorialQuestion" (
    "id" SERIAL NOT NULL,
    "tutorial_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperJourneyTutorialQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeveloperJourneyTutorialQuestion" ADD CONSTRAINT "DeveloperJourneyTutorialQuestion_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "DeveloperJourneyTutorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

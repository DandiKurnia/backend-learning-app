-- CreateTable
CREATE TABLE "TutorialOption" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_label" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TutorialOption" ADD CONSTRAINT "TutorialOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "DeveloperJourneyTutorialQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

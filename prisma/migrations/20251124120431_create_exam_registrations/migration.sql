-- CreateTable
CREATE TABLE "ExamRegistration" (
    "id" SERIAL NOT NULL,
    "tutorial_id" INTEGER NOT NULL,
    "examinees_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deadline_at" TIMESTAMP(3),
    "exam_finished_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ExamRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_examinees_id_fkey" FOREIGN KEY ("examinees_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "DeveloperJourneyTutorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

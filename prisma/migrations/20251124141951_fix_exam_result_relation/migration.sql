-- CreateTable
CREATE TABLE "ExamAnswer" (
    "id" SERIAL NOT NULL,
    "exam_registration_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" SERIAL NOT NULL,
    "exam_registration_id" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "is_passed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "look_report_at" TIMESTAMP(3),

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_exam_registration_id_key" ON "ExamResult"("exam_registration_id");

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_exam_registration_id_fkey" FOREIGN KEY ("exam_registration_id") REFERENCES "ExamRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "DeveloperJourneyTutorialQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "TutorialOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_exam_registration_id_fkey" FOREIGN KEY ("exam_registration_id") REFERENCES "ExamRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

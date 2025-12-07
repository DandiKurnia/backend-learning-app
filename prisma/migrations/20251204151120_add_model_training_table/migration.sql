-- CreateTable
CREATE TABLE "ModelTraining" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "total_activity_day" INTEGER NOT NULL,
    "avg_study_duration" INTEGER NOT NULL,
    "avg_exam_duration" DOUBLE PRECISION NOT NULL,
    "avg_submission_rating" DOUBLE PRECISION NOT NULL,
    "avg_exam_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ModelTraining_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModelTraining" ADD CONSTRAINT "ModelTraining_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

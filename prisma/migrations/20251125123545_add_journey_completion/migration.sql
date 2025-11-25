-- CreateTable
CREATE TABLE "DeveloperJourneyCompletion" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "journey_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "enrolling_times" INTEGER NOT NULL DEFAULT 0,
    "enrollments_at" TIMESTAMP(3),
    "last_enrolled_at" TIMESTAMP(3),
    "study_duration" INTEGER NOT NULL DEFAULT 0,
    "avg_submission_rating" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "DeveloperJourneyCompletion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeveloperJourneyCompletion" ADD CONSTRAINT "DeveloperJourneyCompletion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperJourneyCompletion" ADD CONSTRAINT "DeveloperJourneyCompletion_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "DeveloperJourney"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

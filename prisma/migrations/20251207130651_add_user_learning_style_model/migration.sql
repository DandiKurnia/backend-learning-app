-- CreateTable
CREATE TABLE "UserLearningStyle" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "learning_style" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "avg_completion_ratio" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearningStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLearningStyle_user_id_period_key" ON "UserLearningStyle"("user_id", "period");

-- AddForeignKey
ALTER TABLE "UserLearningStyle" ADD CONSTRAINT "UserLearningStyle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: add patient demographics (age, sex) to CaseIntake
ALTER TABLE "CaseIntake" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "sex" TEXT;

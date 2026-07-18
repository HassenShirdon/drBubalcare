-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'AI_PRE_SCREENED', 'UNDER_REVIEW', 'OPINION_READY', 'CLOSED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "OpinionStatus" AS ENUM ('DRAFT', 'SIGNED', 'DELIVERED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SPECIALIST_OPINION', 'RESULT_INTERPRETATION', 'FOLLOW_UP', 'TREND_ANALYSIS');

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "specialistId" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseRecord" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialistOpinion" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "OpinionStatus" NOT NULL DEFAULT 'DRAFT',
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialistOpinion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPrescreen" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "differentials" TEXT,
    "urgentFlags" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIPrescreen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlainLanguageSummary" (
    "id" TEXT NOT NULL,
    "opinionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlainLanguageSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpQuestion" (
    "id" TEXT NOT NULL,
    "opinionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "scopeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUpQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlainLanguageSummary_opinionId_key" ON "PlainLanguageSummary"("opinionId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseRecord" ADD CONSTRAINT "CaseRecord_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistOpinion" ADD CONSTRAINT "SpecialistOpinion_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistOpinion" ADD CONSTRAINT "SpecialistOpinion_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPrescreen" ADD CONSTRAINT "AIPrescreen_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlainLanguageSummary" ADD CONSTRAINT "PlainLanguageSummary_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "SpecialistOpinion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpQuestion" ADD CONSTRAINT "FollowUpQuestion_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "SpecialistOpinion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

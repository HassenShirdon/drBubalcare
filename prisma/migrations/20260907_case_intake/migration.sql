-- CreateTable
CREATE TABLE "CaseIntake" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "reviewType" TEXT,
    "reasonForRequest" TEXT[],
    "mainConcern" TEXT NOT NULL,
    "diagnosis" TEXT,
    "onsetDate" TEXT,
    "mainSymptoms" TEXT,
    "courseOfCondition" TEXT,
    "medicalHistory" TEXT[],
    "previousOperations" TEXT,
    "medications" JSONB,
    "medicationAllergies" TEXT,
    "labTests" JSONB,
    "imagingTypes" TEXT[],
    "imagingFindings" TEXT,
    "previousOpinions" TEXT,
    "questionsForReview" TEXT,
    "lifestyleFactors" TEXT[],
    "lifestyleNotes" TEXT,
    "familyHistory" TEXT[],
    "patientGoals" TEXT,
    "outcomeDecision" TEXT,
    "documentsToUpload" TEXT[],
    "requestedSpecialty" TEXT,
    "referralReason" TEXT,
    "referralUrgency" TEXT,
    "country" TEXT,
    "preferredLanguage" TEXT,
    "phone" TEXT,
    "preferredCommunication" TEXT[],
    "consentedToReview" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAccuracy" BOOLEAN NOT NULL DEFAULT false,
    "consentedToProcessing" BOOLEAN NOT NULL DEFAULT false,
    "signatureName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseIntake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseIntake_caseId_key" ON "CaseIntake"("caseId");

-- AddForeignKey
ALTER TABLE "CaseIntake" ADD CONSTRAINT "CaseIntake_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

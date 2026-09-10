import { z } from 'zod';

export const SERVICE_TYPES = [
  'SPECIALIST_OPINION',
  'RESULT_INTERPRETATION',
  'FOLLOW_UP',
  'TREND_ANALYSIS',
  'EUROPEAN_REFERRAL',
] as const;

export const REVIEW_TYPES = [
  'BASIC_CASE_REVIEW',
  'COMPREHENSIVE_SECOND_OPINION',
  'SPECIALIST_GLOBAL_EXPERT',
  'MULTIDISCIPLINARY_REVIEW',
] as const;

export const REASON_FOR_REQUEST_OPTIONS = [
  'DIAGNOSIS',
  'TREATMENT_PLAN',
  'MEDICATION',
  'SURGERY_PROCEDURE',
  'LABORATORY_RESULTS',
  'IMAGING_RESULTS',
  'PROGNOSIS',
  'CHRONIC_DISEASE',
  'FERTILITY_REPRODUCTIVE_HEALTH',
  'CHILD_HEALTH',
  'NUTRITION',
  'OTHER',
] as const;

export const MEDICAL_HISTORY_OPTIONS = [
  'DIABETES',
  'HYPERTENSION',
  'HEART_DISEASE',
  'STROKE_TIA',
  'KIDNEY_DISEASE',
  'LIVER_DISEASE',
  'CANCER',
  'ASTHMA_COPD',
  'THYROID_DISEASE',
  'MENTAL_HEALTH',
  'OTHER_CHRONIC_DISEASE',
  'NONE_KNOWN',
] as const;

export const IMAGING_TYPES = [
  'X_RAY',
  'ULTRASOUND',
  'CT',
  'MRI',
  'MAMMOGRAPHY',
  'ECHOCARDIOGRAM',
  'ECG',
  'ENDOSCOPY',
  'BIOPSY_PATHOLOGY',
  'OTHER',
] as const;

export const LIFESTYLE_FACTORS = [
  'SMOKER',
  'ALCOHOL',
  'PHYSICAL_ACTIVITY',
  'SPECIAL_DIET',
  'OCCUPATIONAL_EXPOSURE',
  'OTHER',
] as const;

export const FAMILY_HISTORY_OPTIONS = [
  'DIABETES',
  'HYPERTENSION',
  'HEART_DISEASE',
  'STROKE',
  'KIDNEY_DISEASE',
  'CANCER',
  'GENETIC_DISEASE',
  'INFERTILITY',
  'OTHER',
  'NO_SIGNIFICANT_HISTORY',
] as const;

export const DOCUMENTS_TO_UPLOAD_OPTIONS = [
  'CONSULTATION_NOTES',
  'DIAGNOSIS_REFERRAL',
  'LABORATORY_REPORTS',
  'IMAGING_REPORTS_IMAGES',
  'PATHOLOGY_REPORTS',
  'MEDICATION_LIST',
  'DISCHARGE_SUMMARY',
  'OPERATIVE_REPORT',
  'PREVIOUS_OPINION',
  'OTHER',
] as const;

export const PREFERRED_COMMUNICATION_OPTIONS = [
  'EMAIL',
  'VIDEO',
  'PHONE',
  'OTHER',
] as const;

export const REFERRAL_URGENCIES = [
  'ROUTINE',
  'PRIORITY',
  'URGENT',
] as const;

export const SEX_OPTIONS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const;

export const intakeSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: 'Please enter age' })
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(120, 'Age must be 120 or less'),
  sex: z.enum(SEX_OPTIONS, { required_error: 'Please select sex' }),
  serviceType: z.enum(SERVICE_TYPES),
  reviewType: z.enum(REVIEW_TYPES),
  reasonForRequest: z.array(z.enum(REASON_FOR_REQUEST_OPTIONS)).default([]),
  mainConcern: z.string().min(10, 'Please describe your main concern (minimum 10 characters)').max(4000),
  diagnosis: z.string().min(2, 'Please enter your diagnosis or suspected diagnosis').max(500),
  onsetDate: z.string().max(100).optional().or(z.literal('')),
  mainSymptoms: z.string().max(4000).optional().or(z.literal('')),
  courseOfCondition: z.string().max(4000).optional().or(z.literal('')),
  medicalHistory: z.array(z.enum(MEDICAL_HISTORY_OPTIONS)).default([]),
  previousOperations: z.string().max(4000).optional().or(z.literal('')),
  medications: z
    .array(
      z.object({
        name: z.string().max(300).optional().or(z.literal('')),
        dose: z.string().max(200).optional().or(z.literal('')),
        frequency: z.string().max(200).optional().or(z.literal('')),
        reason: z.string().max(300).optional().or(z.literal('')),
        duration: z.string().max(200).optional().or(z.literal('')),
      })
    )
    .default([]),
  medicationAllergies: z.string().max(2000).optional().or(z.literal('')),
  labTests: z
    .array(
      z.object({
        name: z.string().max(300).optional().or(z.literal('')),
        date: z.string().max(100).optional().or(z.literal('')),
        result: z.string().max(500).optional().or(z.literal('')),
        referenceRange: z.string().max(500).optional().or(z.literal('')),
      })
    )
    .default([]),
  imagingTypes: z.array(z.enum(IMAGING_TYPES)).default([]),
  imagingFindings: z.string().max(4000).optional().or(z.literal('')),
  previousOpinions: z.string().max(4000).optional().or(z.literal('')),
  questionsForReview: z.string().max(4000).optional().or(z.literal('')),
  lifestyleFactors: z.array(z.enum(LIFESTYLE_FACTORS)).default([]),
  lifestyleNotes: z.string().max(2000).optional().or(z.literal('')),
  familyHistory: z.array(z.enum(FAMILY_HISTORY_OPTIONS)).default([]),
  patientGoals: z.string().max(2000).optional().or(z.literal('')),
  outcomeDecision: z.string().max(2000).optional().or(z.literal('')),
  documentsToUpload: z.array(z.enum(DOCUMENTS_TO_UPLOAD_OPTIONS)).default([]),
  requestedSpecialty: z.string().max(300).optional().or(z.literal('')),
  referralReason: z.string().max(2000).optional().or(z.literal('')),
  referralUrgency: z.enum(REFERRAL_URGENCIES).optional(),
  country: z.string().max(200).optional().or(z.literal('')),
  preferredLanguage: z.string().max(200).optional().or(z.literal('')),
  phone: z.string().max(100).optional().or(z.literal('')),
  preferredCommunication: z.array(z.enum(PREFERRED_COMMUNICATION_OPTIONS)).default([]),
  consentedToReview: z.boolean().refine((v) => v, 'Consent to clinical review is required'),
  confirmedAccuracy: z.boolean().refine((v) => v, 'Please confirm the information is accurate'),
  consentedToProcessing: z.boolean().refine((v) => v, 'Consent to secure processing is required'),
  signatureName: z.string().min(2, 'Please add your full name as signature').max(300),
});

export type IntakeInput = z.infer<typeof intakeSchema>;
export const intakeDefaultValues: IntakeInput = {
  age: undefined as unknown as number,
  sex: undefined as unknown as (typeof SEX_OPTIONS)[number],
  serviceType: 'SPECIALIST_OPINION',
  reviewType: 'COMPREHENSIVE_SECOND_OPINION',
  reasonForRequest: [],
  mainConcern: '',
  diagnosis: '',
  onsetDate: '',
  mainSymptoms: '',
  courseOfCondition: '',
  medicalHistory: [],
  previousOperations: '',
  medications: [],
  medicationAllergies: '',
  labTests: [],
  imagingTypes: [],
  imagingFindings: '',
  previousOpinions: '',
  questionsForReview: '',
  lifestyleFactors: [],
  lifestyleNotes: '',
  familyHistory: [],
  patientGoals: '',
  outcomeDecision: '',
  documentsToUpload: [],
  requestedSpecialty: '',
  referralReason: '',
  referralUrgency: undefined,
  country: '',
  preferredLanguage: '',
  phone: '',
  preferredCommunication: [],
  consentedToReview: false,
  confirmedAccuracy: false,
  consentedToProcessing: false,
  signatureName: '',
};
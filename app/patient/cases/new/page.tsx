"use client";

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  Info,
  Loader2,
  Pill,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  TrendingUp,
  Upload,
  User,
  MessageCircle,
  TestTube2,
} from 'lucide-react';
import {
  intakeSchema,
  type IntakeInput,
  intakeDefaultValues,
} from '@/lib/schemas/intake.schema';
import { useCreateCase } from '@/lib/hooks/use-cases';

/* ------------------------------------------------------------------ */
/* Option labels                                                       */
/* ------------------------------------------------------------------ */

const serviceOptions: { value: IntakeInput['serviceType']; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'SPECIALIST_OPINION',
    label: 'Specialist Opinion',
    description: 'Submit slides, scans, or reports for a board-certified specialist to review.',
    icon: <Stethoscope className="size-5" />,
  },
  {
    value: 'RESULT_INTERPRETATION',
    label: 'Result Interpretation',
    description: 'Have existing lab results or reports explained in plain language.',
    icon: <ClipboardList className="size-5" />,
  },
  {
    value: 'FOLLOW_UP',
    label: 'Follow-up Consultation',
    description: 'Ask questions about a previous report or book a live consultation.',
    icon: <MessageCircle className="size-5" />,
  },
  {
    value: 'TREND_ANALYSIS',
    label: 'Lab Trend Analysis',
    description: 'Track repeat lab tests over time and get alerts on significant changes.',
    icon: <TrendingUp className="size-5" />,
  },
];

const reviewTypeOptions = [
  { value: 'BASIC_CASE_REVIEW', label: 'Basic case review' },
  { value: 'COMPREHENSIVE_SECOND_OPINION', label: 'Comprehensive second opinion' },
  { value: 'SPECIALIST_GLOBAL_EXPERT', label: 'Specialist / global expert review' },
  { value: 'MULTIDISCIPLINARY_REVIEW', label: 'Multidisciplinary review' },
] as const;

const sexOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
] as const;

const reasonOptions = [
  { value: 'DIAGNOSIS', label: 'Diagnosis' },
  { value: 'TREATMENT_PLAN', label: 'Treatment plan' },
  { value: 'MEDICATION', label: 'Medication' },
  { value: 'SURGERY_PROCEDURE', label: 'Surgery / procedure' },
  { value: 'LABORATORY_RESULTS', label: 'Laboratory results' },
  { value: 'IMAGING_RESULTS', label: 'Imaging results' },
  { value: 'PROGNOSIS', label: 'Prognosis' },
  { value: 'CHRONIC_DISEASE', label: 'Chronic disease' },
  { value: 'FERTILITY_REPRODUCTIVE_HEALTH', label: 'Fertility / reproductive health' },
  { value: 'CHILD_HEALTH', label: 'Child health' },
  { value: 'NUTRITION', label: 'Nutrition' },
  { value: 'OTHER', label: 'Other' },
] as const;

const medicalHistoryOptions = [
  { value: 'DIABETES', label: 'Diabetes' },
  { value: 'HYPERTENSION', label: 'Hypertension' },
  { value: 'HEART_DISEASE', label: 'Heart disease' },
  { value: 'STROKE_TIA', label: 'Stroke / TIA' },
  { value: 'KIDNEY_DISEASE', label: 'Kidney disease' },
  { value: 'LIVER_DISEASE', label: 'Liver disease' },
  { value: 'CANCER', label: 'Cancer' },
  { value: 'ASTHMA_COPD', label: 'Asthma / COPD' },
  { value: 'THYROID_DISEASE', label: 'Thyroid disease' },
  { value: 'MENTAL_HEALTH', label: 'Mental health condition' },
  { value: 'OTHER_CHRONIC_DISEASE', label: 'Other chronic disease' },
  { value: 'NONE_KNOWN', label: 'None known' },
] as const;

const imagingOptions = [
  { value: 'X_RAY', label: 'X-ray' },
  { value: 'ULTRASOUND', label: 'Ultrasound' },
  { value: 'CT', label: 'CT' },
  { value: 'MRI', label: 'MRI' },
  { value: 'MAMMOGRAPHY', label: 'Mammography' },
  { value: 'ECHOCARDIOGRAM', label: 'Echocardiogram' },
  { value: 'ECG', label: 'ECG' },
  { value: 'ENDOSCOPY', label: 'Endoscopy' },
  { value: 'BIOPSY_PATHOLOGY', label: 'Biopsy / pathology' },
  { value: 'OTHER', label: 'Other' },
] as const;

const lifestyleOptions = [
  { value: 'SMOKER', label: 'Smoker / nicotine use' },
  { value: 'ALCOHOL', label: 'Alcohol use' },
  { value: 'PHYSICAL_ACTIVITY', label: 'Regular physical activity' },
  { value: 'SPECIAL_DIET', label: 'Special diet' },
  { value: 'OCCUPATIONAL_EXPOSURE', label: 'Relevant occupational exposure' },
  { value: 'OTHER', label: 'Other' },
] as const;

const familyHistoryOptions = [
  { value: 'DIABETES', label: 'Diabetes' },
  { value: 'HYPERTENSION', label: 'Hypertension' },
  { value: 'HEART_DISEASE', label: 'Heart disease' },
  { value: 'STROKE', label: 'Stroke' },
  { value: 'KIDNEY_DISEASE', label: 'Kidney disease' },
  { value: 'CANCER', label: 'Cancer' },
  { value: 'GENETIC_DISEASE', label: 'Genetic disease' },
  { value: 'INFERTILITY', label: 'Infertility' },
  { value: 'OTHER', label: 'Other' },
  { value: 'NO_SIGNIFICANT_HISTORY', label: 'No significant history known' },
] as const;

const communicationOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'OTHER', label: 'Other' },
] as const;

const documentOptions = [
  { value: 'CONSULTATION_NOTES', label: 'Consultation notes' },
  { value: 'DIAGNOSIS_REFERRAL', label: 'Diagnosis / referral' },
  { value: 'LABORATORY_REPORTS', label: 'Laboratory reports' },
  { value: 'IMAGING_REPORTS_IMAGES', label: 'Imaging reports / images' },
  { value: 'PATHOLOGY_REPORTS', label: 'Pathology reports' },
  { value: 'MEDICATION_LIST', label: 'Medication list' },
  { value: 'DISCHARGE_SUMMARY', label: 'Discharge summary' },
  { value: 'OPERATIVE_REPORT', label: 'Operative report' },
  { value: 'PREVIOUS_OPINION', label: 'Previous specialist opinion' },
  { value: 'OTHER', label: 'Other relevant documents' },
] as const;

const urgencyOptions = [
  { value: 'ROUTINE', label: 'Routine' },
  { value: 'PRIORITY', label: 'Priority' },
  { value: 'URGENT', label: 'Urgent clinical assessment advised' },
] as const;

/* ------------------------------------------------------------------ */
/* Small shared form primitives                                        */
/* ------------------------------------------------------------------ */

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="block font-medium text-pulse-text-primary text-sm mb-1.5">
      {children}
      {optional && <span className="font-normal text-pulse-text-muted"> (optional)</span>}
    </span>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; optional?: boolean; error?: string }) {
  const { label, optional, error, id, ...rest } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div>
      <label htmlFor={inputId} className="block font-medium text-pulse-text-primary text-sm mb-1.5">
        {label}
        {optional && <span className="font-normal text-pulse-text-muted"> (optional)</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full h-11 rounded-xl border bg-white px-3.5 text-sm text-pulse-text-primary placeholder:text-pulse-text-muted outline-none transition-colors focus:ring-2 focus:ring-pulse-navy/30 focus:border-pulse-navy ${
          error ? 'border-pulse-red' : 'border-pulse-border'
        }`}
        {...rest}
      />
      {error && <p id={errorId} className="text-pulse-red text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; optional?: boolean; error?: string }) {
  const { label, optional, error, id, ...rest } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div>
      <label htmlFor={inputId} className="block font-medium text-pulse-text-primary text-sm mb-1.5">
        {label}
        {optional && <span className="font-normal text-pulse-text-muted"> (optional)</span>}
      </label>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-pulse-text-primary placeholder:text-pulse-text-muted outline-none transition-colors focus:ring-2 focus:ring-pulse-navy/30 focus:border-pulse-navy resize-none ${
          error ? 'border-pulse-red' : 'border-pulse-border'
        }`}
        {...rest}
      />
      {error && <p id={errorId} className="text-pulse-red text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  columns?: 1 | 2 | 3;
}) {
  const toggle = (option: string) => {
    if (option === 'NONE_KNOWN' || option === 'NO_SIGNIFICANT_HISTORY') {
      onChange(value.includes(option) ? [] : [option]);
      return;
    }
    const next = value.includes(option) ? value.filter((v) => v !== option) : [...value, option];
    onChange(next);
  };

  return (
    <fieldset>
      <div className={`grid gap-2 grid-cols-1 ${columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-3' : ''}`}>
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-pointer select-none transition-all text-sm font-medium ${
                checked
                  ? 'border-pulse-navy bg-pulse-navy/5 text-pulse-navy'
                  : 'border-pulse-border bg-white text-pulse-text-primary hover:border-pulse-navy/30'
              }`}
            >
              <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  checked ? 'border-pulse-navy bg-pulse-navy text-white' : 'border-pulse-border-strong bg-white text-transparent'
                }`}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RowBuilder({
  fields,
  values,
  onChange,
  addLabel,
}: {
  fields: { key: string; label: string; placeholder?: string; span?: 1 | 2 }[];
  values: Record<string, string>[];
  onChange: (next: Record<string, string>[]) => void;
  addLabel: string;
}) {
  const update = (index: number, key: string, fieldValue: string) => {
    const next = values.map((row, i) => (i === index ? { ...row, [key]: fieldValue } : row));
    onChange(next);
  };
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {(values ?? []).map((row, index) => (
        <div key={index} className="rounded-xl border border-pulse-border bg-pulse-bg p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-medium text-pulse-text-secondary mb-1">{field.label}</label>
                <input
                  value={row[field.key] ?? ''}
                  onChange={(e) => update(index, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-9 rounded-lg border border-pulse-border bg-white px-3 text-sm text-pulse-text-primary placeholder:text-pulse-text-muted outline-none focus:ring-2 focus:ring-pulse-navy/30 focus:border-pulse-navy"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-pulse-red hover:text-pulse-red transition-colors"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, { ...Object.fromEntries(fields.map((f) => [f.key, ''])) }])}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-pulse-border-strong px-4 py-2.5 text-sm font-medium text-pulse-navy hover:border-pulse-navy/40 hover:bg-pulse-navy/5 transition-all"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wizard                                                              */
/* ------------------------------------------------------------------ */

const steps = [
  { key: 'demographics', label: 'About You', icon: <Info className="size-4" /> },
  { key: 'service', label: 'Service & Reason', icon: <ClipboardList className="size-4" /> },
  { key: 'problem', label: 'Medical Problem', icon: <HeartPulse className="size-4" /> },
  { key: 'history', label: 'Medical History', icon: <History className="size-4" /> },
  { key: 'treatment', label: 'Current Treatment', icon: <Pill className="size-4" /> },
  { key: 'tests', label: 'Test Results', icon: <TestTube2 className="size-4" /> },
  { key: 'opinions', label: 'Previous Opinions', icon: <FileText className="size-4" /> },
  { key: 'lifestyle', label: 'Lifestyle', icon: <Sparkles className="size-4" /> },
  { key: 'family', label: 'Family & Goals', icon: <User className="size-4" /> },
  { key: 'review', label: 'Review & Consent', icon: <ShieldCheck className="size-4" /> },
] as const;

const stepSchemas = [
  intakeSchema.pick({ age: true, sex: true }),
  intakeSchema.pick({ serviceType: true, reviewType: true }).partial(),
  intakeSchema.pick({ reasonForRequest: true, mainConcern: true }).partial(),
  intakeSchema
    .pick({ diagnosis: true, onsetDate: true, mainSymptoms: true, courseOfCondition: true })
    .partial(),
  intakeSchema
    .pick({
      medicalHistory: true,
      previousOperations: true,
      medications: true,
      medicationAllergies: true,
    })
    .partial(),
  intakeSchema.pick({ labTests: true, imagingTypes: true, imagingFindings: true }).partial(),
  intakeSchema.pick({ previousOpinions: true, questionsForReview: true }).partial(),
  intakeSchema
    .pick({
      lifestyleFactors: true,
      lifestyleNotes: true,
      requestedSpecialty: true,
      referralReason: true,
      referralUrgency: true,
    })
    .partial(),
  intakeSchema
    .pick({
      familyHistory: true,
      patientGoals: true,
      outcomeDecision: true,
      documentsToUpload: true,
      country: true,
      phone: true,
      preferredLanguage: true,
      preferredCommunication: true,
    })
    .partial(),
  intakeSchema
    .pick({
      consentedToReview: true,
      confirmedAccuracy: true,
      consentedToProcessing: true,
      signatureName: true,
    })
    .partial(),
];

const stepKeyToSchemaTitle: Record<string, string> = {
  demographics: 'About You',
  service: 'Service & Reason for Request',
  problem: 'Main Medical Problem',
  history: 'Medical History',
  treatment: 'Current Treatment',
  tests: 'Laboratory & Diagnostic Tests',
  opinions: 'Previous Medical Opinions',
  lifestyle: 'Lifestyle & Global Referral',
  family: 'Family History & Goals',
  review: 'Consent & Confirmation',
};

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pulse-navy text-xs font-bold text-white">
          {number}
        </span>
        <h2 className="font-bold text-pulse-navy text-base">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AlertInfo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-pulse-info-light bg-pulse-info-light/60 px-3.5 py-3 text-xs text-pulse-navy">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

export default function NewCasePage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const createCase = useCreateCase();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const form = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema) as never,
    defaultValues: intakeDefaultValues,
    mode: 'onTouched',
  });

  const { register, control, formState, getValues, trigger, setError, watch } = form;

  const validateStep = async (index: number) => {
    const values = getValues();
    const schema = stepSchemas[index];
    const res = schema.safeParse(values);
    if (!res.success) return false;
    return true;
  };

  const goNext = async () => {
    const ok = await validateStep(step);
    if (!ok) {
      await trigger();
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async () => {
    const ok = await trigger();
    if (!ok) {
      const firstError = formState.errors;
      const keys = Object.keys(firstError) as (keyof IntakeInput)[];
      if (keys.length > 0) {
        const errorSteps: Record<string, number> = {
          serviceType: 0,
          reviewType: 0,
          mainConcern: 1,
          reasonForRequest: 1,
          diagnosis: 2,
          onsetDate: 2,
          mainSymptoms: 2,
          courseOfCondition: 2,
          medicalHistory: 3,
          previousOperations: 3,
          medications: 3,
          medicationAllergies: 3,
          labTests: 4,
          imagingTypes: 4,
          imagingFindings: 4,
          previousOpinions: 5,
          questionsForReview: 5,
          lifestyleFactors: 6,
          lifestyleNotes: 6,
          requestedSpecialty: 6,
          referralReason: 6,
          referralUrgency: 6,
          familyHistory: 7,
          patientGoals: 7,
          outcomeDecision: 7,
          documentsToUpload: 7,
          country: 7,
          phone: 7,
          preferredLanguage: 7,
          preferredCommunication: 7,
          consentedToReview: 8,
          confirmedAccuracy: 8,
          consentedToProcessing: 8,
          signatureName: 8,
        };
        const firstKey = keys[0];
        setStep(errorSteps[firstKey] ?? 0);
      }
      return;
    }

    const values = getValues();
    const stepResults: boolean[] = [];
    for (let i = 0; i < stepSchemas.length; i++) {
      stepResults.push(await validateStep(i));
    }
    if (stepResults.some((ok) => !ok)) {
      const firstInvalid = stepResults.indexOf(false);
      setStep(firstInvalid === -1 ? 0 : firstInvalid);
      return;
    }

    setSaving(true);
    try {
      const result = await createCase.mutateAsync({
        serviceType: values.serviceType,
        description:
          values.reasonForRequest.length > 0
            ? `Reason for request: ${values.reasonForRequest.join(', ')}\nDiagnosis: ${values.diagnosis || 'Not specified'}\nMain symptoms: ${values.mainSymptoms || 'Not specified'}`
            : `${values.diagnosis ? `Diagnosis: ${values.diagnosis}. ` : ''}${values.mainConcern}`,
        intake: { ...values },
      });
      router.push(`/patient/cases/${result.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create case';
      setError('signatureName', { type: 'root', message });
      setSaving(false);
    }
  };

  const bindCheckbox = (name: keyof IntakeInput) => ({
    value: watch(name) as unknown as string[],
    onChange: (next: string[]) => form.setValue(name as never, next as never, { shouldDirty: true }),
  });

  const progress = ((step + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SectionCard number={1} title="About You">
            <p className="text-sm text-pulse-text-secondary">
              We collect only age and sex (not your name or date of birth) as clinical context for the
              reviewing specialist and our AI pre-screening, in line with our privacy practices.
            </p>

            <div>
              <label htmlFor="case-age" className="block font-medium text-pulse-text-primary text-sm mb-1.5">
                Age
              </label>
              <input
                id="case-age"
                type="number"
                inputMode="numeric"
                min={0}
                max={120}
                placeholder="e.g. 34"
                {...register('age', { valueAsNumber: true })}
                className="w-full rounded-xl border border-pulse-border bg-white px-3.5 py-2.5 text-sm text-pulse-text-primary placeholder:text-pulse-text-muted outline-none focus:border-pulse-navy focus:ring-2 focus:ring-pulse-navy/20 transition-all"
              />
              {formState.errors.age && (
                <p className="text-pulse-red text-xs mt-2">{formState.errors.age.message}</p>
              )}
            </div>

            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Sex</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sexOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-pointer select-none transition-all text-sm font-medium ${
                          field.value === opt.value
                            ? 'border-pulse-navy bg-pulse-navy/5 text-pulse-navy'
                            : 'border-pulse-border bg-white text-pulse-text-primary hover:border-pulse-navy/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sex"
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            field.value === opt.value ? 'border-pulse-navy' : 'border-pulse-border-strong'
                          }`}
                        >
                          {field.value === opt.value && (
                            <span className="size-2.5 rounded-full bg-pulse-navy" />
                          )}
                        </span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {formState.errors.sex && (
                    <p className="text-pulse-red text-xs mt-2">{formState.errors.sex.message}</p>
                  )}
                </div>
              )}
            />
          </SectionCard>
        );

      case 1:
        return (
          <SectionCard number={2} title="Choose a service and tell us why you're here">
            <div>
              <Label>Service type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((opt) => {
                  const selected = watch('serviceType') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => form.setValue('serviceType', opt.value, { shouldValidate: true })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selected ? 'border-pulse-navy bg-pulse-navy/5' : 'border-pulse-border bg-white hover:border-pulse-navy/30'
                      }`}
                    >
                      <div className={`mb-2 ${selected ? 'text-pulse-navy' : 'text-pulse-text-secondary'}`}>{opt.icon}</div>
                      <p className={`font-medium text-sm ${selected ? 'text-pulse-navy' : 'text-pulse-text-primary'}`}>{opt.label}</p>
                      <p className="text-pulse-text-secondary text-xs mt-1">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
              {formState.errors.serviceType && (
                <p className="text-pulse-red text-xs mt-2">{formState.errors.serviceType.message}</p>
              )}
            </div>

            <Controller
              name="reviewType"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Requested clinical review</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reviewTypeOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-pointer select-none transition-all text-sm font-medium ${
                          field.value === opt.value
                            ? 'border-pulse-navy bg-pulse-navy/5 text-pulse-navy'
                            : 'border-pulse-border bg-white text-pulse-text-primary hover:border-pulse-navy/30'
                        }`}
                      >
                        <input type="radio" name="reviewType" checked={field.value === opt.value} onChange={() => field.onChange(opt.value)} className="sr-only" />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            field.value === opt.value ? 'border-pulse-navy' : 'border-pulse-border-strong'
                          }`}
                        >
                          {field.value === opt.value && <span className="size-2.5 rounded-full bg-pulse-navy" />}
                        </span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {formState.errors.reviewType && (
                    <p className="text-pulse-red text-xs mt-2">{formState.errors.reviewType.message}</p>
                  )}
                </div>
              )}
            />

            <div>
              <Label>Reason for requesting a second opinion (select all that apply)</Label>
              <CheckboxGroup name="reasonForRequest" options={reasonOptions} columns={3} {...bindCheckbox('reasonForRequest')} />
            </div>

            <TextArea
              label="Main concern / questions you want reviewed"
              error={formState.errors.mainConcern?.message}
              rows={4}
              placeholder="Describe what you would like a specialist to review..."
              {...register('mainConcern')}
            />
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard number={3} title="Main Medical Problem">
            <TextInput
              label="Diagnosis / suspected diagnosis"
              optional
              error={formState.errors.diagnosis?.message}
              placeholder="e.g. Suspicious thyroid nodule"
              {...register('diagnosis')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Date / approximate onset"
                optional
                placeholder="e.g. March 2026"
                {...register('onsetDate')}
              />
            </div>
            <TextArea
              label="Main symptoms"
              optional
              rows={4}
              placeholder="Describe your symptoms..."
              {...register('mainSymptoms')}
            />
            <TextArea
              label="Course / progression"
              optional
              rows={3}
              placeholder="How has the condition developed over time?"
              {...register('courseOfCondition')}
            />
          </SectionCard>
        );

      case 3:
        return (
          <SectionCard number={4} title="Medical History">
            <div>
              <Label>Chronic conditions (select all that apply)</Label>
              <CheckboxGroup name="medicalHistory" options={medicalHistoryOptions} {...bindCheckbox('medicalHistory')} />
            </div>
            <TextArea
              label="Previous operations / hospitalizations"
              optional
              rows={3}
              placeholder="List any surgeries or hospital stays..."
              {...register('previousOperations')}
            />
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard number={5} title="Current Treatment">
            <div>
              <Label optional>Medication / therapy</Label>
              <Controller
                name="medications"
                control={control}
                render={({ field }) => (
                  <RowBuilder
                    addLabel="Add medication"
                    fields={[
                      { key: 'name', label: 'Medication name', placeholder: 'e.g. Metformin' },
                      { key: 'dose', label: 'Dose & frequency', placeholder: 'e.g. 500 mg twice daily' },
                      { key: 'reason', label: 'Reason', placeholder: 'e.g. Type 2 diabetes' },
                      { key: 'duration', label: 'Duration', placeholder: 'e.g. Since 2021' },
                    ]}
                    values={field.value}
                    onChange={(next) => field.onChange(next as never)}
                  />
                )}
              />
            </div>
            <TextInput
              label="Medication allergies / adverse reactions"
              optional
              error={formState.errors.medicationAllergies?.message}
              placeholder="e.g. Penicillin — rash"
              {...register('medicationAllergies')}
            />
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard number={6} title="Laboratory, Imaging & Procedures">
            <div>
              <Label optional>Laboratory / diagnostic tests</Label>
              <Controller
                name="labTests"
                control={control}
                render={({ field }) => (
                  <RowBuilder
                    addLabel="Add lab test"
                    fields={[
                      { key: 'name', label: 'Test', placeholder: 'e.g. HbA1c' },
                      { key: 'date', label: 'Date', placeholder: 'e.g. 2026-06-01' },
                      { key: 'result', label: 'Result', placeholder: 'e.g. 7.1 %' },
                      { key: 'referenceRange', label: 'Reference range / comments', placeholder: 'e.g. 4.0-5.6 %' },
                    ]}
                    values={field.value}
                    onChange={(next) => field.onChange(next as never)}
                  />
                )}
              />
            </div>
            <div>
              <Label optional>Imaging & procedures performed</Label>
              <CheckboxGroup name="imagingTypes" options={imagingOptions} {...bindCheckbox('imagingTypes')} />
            </div>
            <TextArea
              label="Findings / report summary"
              optional
              rows={4}
              placeholder="Summarize what the imaging or procedure showed..."
              {...register('imagingFindings')}
            />
          </SectionCard>
        );

      case 6:
        return (
          <SectionCard number={7} title="Previous Medical Opinions">
            <TextArea
              label="Previous diagnosis and recommendations"
              optional
              rows={4}
              placeholder="What were you previously told or prescribed?"
              {...register('previousOpinions')}
            />
            <TextArea
              label="What would you like clarified or reconsidered?"
              optional
              rows={4}
              placeholder="e.g. Does the recommended surgery need a second look?"
              {...register('questionsForReview')}
            />
          </SectionCard>
        );

      case 7:
        return (
          <SectionCard number={8} title="Lifestyle & Global Doctor Network Referral">
            <div>
              <Label optional>Lifestyle & social information (select all that apply)</Label>
              <CheckboxGroup name="lifestyleFactors" options={lifestyleOptions} {...bindCheckbox('lifestyleFactors')} />
            </div>
            <TextArea
              label="Other relevant lifestyle or social factors"
              optional
              rows={3}
              {...register('lifestyleNotes')}
            />

            {watch('serviceType') === 'EUROPEAN_REFERRAL' && (
              <div className="rounded-xl border border-pulse-info-light bg-pulse-info-light/60 p-4 space-y-4">
                <p className="text-sm font-semibold text-pulse-navy">Global Doctor Network referral details</p>
                <TextInput
                  label="Specialty requested"
                  optional
                  placeholder="e.g. Surgical oncology"
                  {...register('requestedSpecialty')}
                />
                <TextArea label="Reason for referral" optional rows={3} {...register('referralReason')} />
                <Controller
                  name="referralUrgency"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label optional>Urgency</Label>
                      <div className="flex flex-wrap gap-2">
                        {urgencyOptions.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 cursor-pointer select-none transition-all text-sm font-medium ${
                              field.value === opt.value
                                ? 'border-pulse-navy bg-pulse-navy/5 text-pulse-navy'
                                : 'border-pulse-border bg-white text-pulse-text-primary hover:border-pulse-navy/30'
                            }`}
                          >
                            <input type="radio" name="referralUrgency" checked={field.value === opt.value} onChange={() => field.onChange(opt.value)} className="sr-only" />
                            <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${field.value === opt.value ? 'border-pulse-navy' : 'border-pulse-border-strong'}`}>
                              {field.value === opt.value && <span className="size-2.5 rounded-full bg-pulse-navy" />}
                            </span>
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </SectionCard>
        );

      case 8:
        return (
          <SectionCard number={9} title="Family History, Goals & Documents">
            <div>
              <Label optional>Family history (select all that apply)</Label>
              <CheckboxGroup name="familyHistory" options={familyHistoryOptions} {...bindCheckbox('familyHistory')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Country / residence" optional placeholder="e.g. United States" {...register('country')} />
              <TextInput label="Preferred language" optional placeholder="e.g. English" {...register('preferredLanguage')} />
            </div>
            <TextInput label="Phone / WhatsApp" optional placeholder="+1 555 000 0000" {...register('phone')} />
            <div>
              <Label optional>Preferred communication</Label>
              <CheckboxGroup name="preferredCommunication" options={communicationOptions} {...bindCheckbox('preferredCommunication')} />
            </div>
            <TextArea label="Patient goals & expectations" optional rows={3} placeholder="What outcome or decision should this review help you with?" {...register('patientGoals')} />
            <div>
              <Label optional>Which documents will you upload?</Label>
              <CheckboxGroup name="documentsToUpload" options={documentOptions} {...bindCheckbox('documentsToUpload')} />
              <p className="text-xs text-pulse-text-secondary mt-2">
                You can upload the actual files right after the case is created.
              </p>
            </div>
          </SectionCard>
        );

      case 9:
        return (
          <SectionCard number={10} title="Consent, Confirmation & Submission">
            <AlertInfo>
              This service provides an additional evidence-based medical opinion and does not replace emergency care
              or the responsibility of your treating clinician. Recommendations depend on the accuracy and completeness
              of the information supplied. Urgent or emergency symptoms require appropriate local emergency medical care.
            </AlertInfo>
            {(
              [
                { key: 'consentedToReview', label: 'I consent to clinical review of the information I provide.' },
                { key: 'confirmedAccuracy', label: 'I confirm that the information provided is accurate to the best of my knowledge.' },
                { key: 'consentedToProcessing', label: 'I consent to secure processing of my health information for the requested review.' },
              ] as const
            ).map((c) => {
              const checked = watch(c.key) === true;
              return (
                <label key={c.key} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 cursor-pointer select-none transition-all text-sm font-medium ${checked ? 'border-pulse-navy bg-pulse-navy/5 text-pulse-navy' : 'border-pulse-border bg-white text-pulse-text-primary hover:border-pulse-navy/30'}`}>
                  <input type="checkbox" checked={checked} onChange={() => form.setValue(c.key, !checked, { shouldValidate: true })} className="sr-only" />
                  <span aria-hidden="true" className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${checked ? 'border-pulse-navy bg-pulse-navy text-white' : 'border-pulse-border-strong bg-white text-transparent'}`}>
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {c.label}
                </label>
              );
            })}
            {formState.errors.consentedToReview && (
              <p className="text-pulse-red text-xs">{formState.errors.consentedToReview.message}</p>
            )}
            {formState.errors.confirmedAccuracy && (
              <p className="text-pulse-red text-xs">{formState.errors.confirmedAccuracy.message}</p>
            )}
            {formState.errors.consentedToProcessing && (
              <p className="text-pulse-red text-xs">{formState.errors.consentedToProcessing.message}</p>
            )}
            <TextInput
              label="Patient / authorized representative signature (full name)"
              error={
                formState.errors.signatureName?.type === 'root'
                  ? undefined
                  : formState.errors.signatureName?.message
              }
              placeholder="Type your full legal name"
              {...register('signatureName')}
            />
            {formState.errors.signatureName?.type === 'root' && (
              <div role="alert" className="bg-pulse-red-light border border-pulse-red rounded-xl p-4 text-pulse-red text-sm">
                {formState.errors.signatureName.message}
              </div>
            )}
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 md:pb-8">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/patient/cases"
          className="inline-flex items-center gap-1 text-pulse-text-secondary text-sm hover:text-pulse-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <h1 className="text-pulse-navy font-bold text-2xl md:text-3xl">Patient Case Review</h1>
        <p className="text-pulse-text-secondary mt-1 text-sm">
          Complete the case review form — your answers give the specialist and AI pre-screening the full clinical picture.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mt-6 mb-5">
        <div className="flex items-center justify-between text-xs font-medium text-pulse-text-secondary mb-2">
          <span className="inline-flex items-center gap-1.5 text-pulse-navy font-semibold">
            {steps[step].icon}
            {stepKeyToSchemaTitle[steps[step].key]}
          </span>
          <span>{`${Math.min(step + 1, steps.length)} of ${steps.length}`}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 rounded-full bg-pulse-border overflow-hidden"
        >
          <div className="h-full rounded-full bg-pulse-navy transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step chips */}
      <div className="hidden md:flex flex-wrap gap-1.5 mb-6">
        {steps.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStep(i)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              i === step
                ? 'bg-pulse-navy text-white'
                : i < step
                ? 'bg-pulse-info-light text-pulse-navy hover:bg-pulse-info'
                : 'bg-pulse-surface-elevated text-pulse-text-secondary hover:bg-pulse-border'
            }`}
          >
            {i < step ? <Check className="size-3" /> : <span>{i + 1}</span>}
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (step === steps.length - 1) onSubmit(); else goNext(); }}>
        <motion.div
          key={step}
          initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-pulse-border shadow-sm p-5 md:p-8"
        >
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-pulse-border">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || saving}
              className="inline-flex items-center gap-2 rounded-xl border border-pulse-border bg-white px-5 py-2.5 text-sm font-medium text-pulse-navy hover:bg-pulse-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-pulse-navy text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-pulse-navy/90 transition-colors"
              >
                Continue
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving || createCase.isPending}
                className="inline-flex items-center gap-2 bg-pulse-success text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-pulse-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving || createCase.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating case...
                  </>
                ) : createCase.isSuccess ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Case Created
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    Submit & Create Case
                  </>
                )}
              </button>
            )}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-pulse-text-muted">
            <Upload className="size-3.5" />
            After creating the case you can securely upload your records (PDF, JPEG, PNG, WebP — up to 50MB each).
          </p>
        </motion.div>
      </form>
    </div>
  );
}
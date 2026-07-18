"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCaseSchema, type CreateCaseInput } from '@/lib/schemas/case.schema';
import { useCreateCase } from '@/lib/hooks/use-cases';
import { ArrowLeft, FileText, Stethoscope, ClipboardList, TrendingUp, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const serviceOptions = [
  {
    value: 'SPECIALIST_OPINION' as const,
    label: 'Specialist Opinion',
    description: 'Submit slides, scans, or reports for a board-certified specialist to review.',
    icon: <Stethoscope className="size-5" />,
  },
  {
    value: 'RESULT_INTERPRETATION' as const,
    label: 'Result Interpretation',
    description: 'Have existing lab results or reports explained in plain language.',
    icon: <ClipboardList className="size-5" />,
  },
  {
    value: 'FOLLOW_UP' as const,
    label: 'Follow-up Consultation',
    description: 'Ask questions about a previous report or book a live consultation.',
    icon: <MessageCircle className="size-5" />,
  },
  {
    value: 'TREND_ANALYSIS' as const,
    label: 'Lab Trend Analysis',
    description: 'Track repeat lab tests over time and get alerts on significant changes.',
    icon: <TrendingUp className="size-5" />,
  },
];

export default function NewCasePage() {
  const router = useRouter();
  const createCase = useCreateCase();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCaseInput>({
    resolver: zodResolver(createCaseSchema),
  });

  const onSubmit = async (data: CreateCaseInput) => {
    try {
      const result = await createCase.mutateAsync(data);
      router.push(`/patient/cases/${result.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="p-4 md:p-margin-desktop max-w-3xl mx-auto pb-24 md:pb-8 space-y-stack-xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/patient/cases"
          className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-clinical-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl">Start a New Case</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Select a service type and describe your case. You can upload files after creating the case.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Type Selection */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block font-headline-md font-bold text-clinical-navy text-base mb-3">
            Service Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedService(opt.value);
                  register('serviceType').onChange({ target: { value: opt.value } });
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedService === opt.value
                    ? 'border-clinical-navy bg-clinical-navy/5'
                    : 'border-surface-gray bg-white hover:border-clinical-navy/30'
                }`}
              >
                <div className={`mb-2 ${selectedService === opt.value ? 'text-clinical-navy' : 'text-on-surface-variant'}`}>
                  {opt.icon}
                </div>
                <p className={`font-medium text-sm ${selectedService === opt.value ? 'text-clinical-navy' : 'text-text-medical-black'}`}>
                  {opt.label}
                </p>
                <p className="text-on-surface-variant text-xs mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
          {errors.serviceType && (
            <p className="text-error text-xs mt-2">{errors.serviceType.message}</p>
          )}
          <input type="hidden" {...register('serviceType')} />
        </motion.section>

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="description" className="block font-headline-md font-bold text-clinical-navy text-base mb-3">
            Case Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            placeholder="Describe your case, symptoms, or what you need reviewed..."
            className="w-full px-4 py-3 rounded-xl border border-surface-gray bg-white text-text-medical-black placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-clinical-navy/30 focus:border-clinical-navy resize-none text-sm"
          />
          {errors.description && (
            <p className="text-error text-xs mt-2">{errors.description.message}</p>
          )}
        </motion.section>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <button
            type="submit"
            disabled={createCase.isPending}
            className="inline-flex items-center gap-2 bg-clinical-navy text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-clinical-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCase.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : createCase.isSuccess ? (
              <>
                <CheckCircle2 className="size-4" />
                Case Created
              </>
            ) : (
              <>
                <FileText className="size-4" />
                Create Case
              </>
            )}
          </button>
          <Link
            href="/patient/cases"
            className="text-on-surface-variant text-sm font-medium hover:text-clinical-navy transition-colors"
          >
            Cancel
          </Link>
        </motion.div>

        {createCase.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {createCase.error.message}
          </div>
        )}
      </form>
    </div>
  );
}

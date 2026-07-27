"use client";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCaseInput>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: { serviceType: undefined, description: '' },
  });

  const selectedService = watch('serviceType');

  const onSubmit = async (data: CreateCaseInput) => {
    try {
      const result = await createCase.mutateAsync(data);
      router.push(`/patient/cases/${result.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/patient/cases"
          className="inline-flex items-center gap-1 text-[#64748B] text-sm hover:text-[#1E3A5F] transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl">Start a New Case</h1>
        <p className="text-[#64748B] mt-1 text-sm">
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
          <label className="block font-bold text-[#1E3A5F] text-base mb-3">
            Service Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setValue('serviceType', opt.value, { shouldValidate: true });
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedService === opt.value
                    ? 'border-[#1E3A5F] bg-[#1E3A5F]/5'
                    : 'border-[#E2E8F0] bg-white hover:border-[#1E3A5F]/30'
                }`}
              >
                <div className={`mb-2 ${selectedService === opt.value ? 'text-[#1E3A5F]' : 'text-[#64748B]'}`}>
                  {opt.icon}
                </div>
                <p className={`font-medium text-sm ${selectedService === opt.value ? 'text-[#1E3A5F]' : 'text-[#0F172A]'}`}>
                  {opt.label}
                </p>
                <p className="text-[#64748B] text-xs mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
          {errors.serviceType && (
            <p className="text-[#B91C1C] text-xs mt-2">{errors.serviceType.message}</p>
          )}
          </motion.section>

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="description" className="block font-bold text-[#1E3A5F] text-base mb-3">
            Case Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            placeholder="Describe your case, symptoms, or what you need reviewed..."
            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 focus:border-[#1E3A5F] resize-none text-sm"
          />
          {errors.description && (
            <p className="text-[#B91C1C] text-xs mt-2">{errors.description.message}</p>
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
            className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#1E3A5F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="text-[#64748B] text-sm font-medium hover:text-[#1E3A5F] transition-colors"
          >
            Cancel
          </Link>
        </motion.div>

        {createCase.isError && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 text-[#B91C1C] text-sm">
            {createCase.error.message}
          </div>
        )}
      </form>
    </div>
  );
}

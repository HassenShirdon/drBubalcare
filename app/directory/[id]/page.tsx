"use client"
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentInput } from '@/lib/schemas/appointment.schema';
import { useAppointmentStore } from '@/lib/stores/appointment-store';

const SERVICE_LABELS: Record<string, { name: string; price: string }> = {
  'initial-evaluation': { name: 'Initial Evaluation', price: '$250' },
  'follow-up-session': { name: 'Follow-up Session', price: '$125' },
};

export default function DoctorProfile() {
  const { step, selectedServiceId, selectedDate, selectedTime, nextStep, prevStep, selectService, selectDateTime, reset } = useAppointmentStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { serviceId: '', date: '', time: '' },
  });

  useEffect(() => {
    if (selectedServiceId) setValue('serviceId', selectedServiceId);
  }, [selectedServiceId, setValue]);

  useEffect(() => {
    if (selectedDate) setValue('date', selectedDate);
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) setValue('time', selectedTime);
  }, [selectedTime, setValue]);

  const handleConfirm = (data: AppointmentInput) => {
    selectService(data.serviceId);
    selectDateTime(data.date, data.time);
    alert('Appointment Confirmed');
    reset();
  };

  const serviceLabel = selectedServiceId ? SERVICE_LABELS[selectedServiceId]?.name : 'Not selected';
  const dateTimeLabel = selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : 'Not selected';
  const priceLabel = selectedServiceId ? SERVICE_LABELS[selectedServiceId]?.price : '$0';

  return (
    <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto pb-24 md:pb-8 space-y-stack-lg">
      {/* Back Button */}
      <Link href="/directory" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-clinical-navy transition-colors mb-4">
        <ArrowLeft className="text-sm" />
        <span className="font-label-md text-sm">Back to Directory</span>
      </Link>

      {/* Profile Header */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border border-surface-gray shadow-sm bg-surface flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-gray overflow-hidden shrink-0 relative">
          <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Dr. Adam Bubal" fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1">
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl mb-1">Dr. Adam Bubal</h1>
          <p className="text-healing-teal font-label-md text-base mb-4 font-bold">Psychiatrist</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Briefcase className="text-sm" />
              <span>15 Yrs Exp</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Star className="text-sm text-yellow-500" />
              <span className="font-bold text-clinical-navy">4.9</span>
              <span>(124)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <MapPin className="text-sm" />
              <span>Telehealth & In-person</span>
            </div>
          </div>
          
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Dr. Bubal specializes in anxiety disorders, depression, and stress management. 
            He uses evidence-based approaches including CBT and medication management to help patients achieve digital sanctuary.
          </p>
        </div>
      </motion.section>

      {/* Booking Wizard */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
        <div className="bg-clinical-navy p-4 text-white">
          <h2 className="font-headline-md font-bold text-lg">Book Consultation</h2>
        </div>
        
        <div className="p-6">
          <div className="wizard-steps mb-8">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Service</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Date & Time</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Details</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Select Service Type</h3>
              <label className={`radio-card p-4 border rounded-xl flex items-start gap-4 cursor-pointer transition-colors relative ${selectedServiceId === 'initial-evaluation' ? 'border-clinical-navy bg-surface-container-low' : 'border-surface-gray hover:border-clinical-navy'}`}>
                <input type="radio" name="service" className="mt-1" checked={selectedServiceId === 'initial-evaluation'} onChange={() => selectService('initial-evaluation')} />
                <div>
                  <h4 className="font-bold text-clinical-navy text-base">Initial Evaluation</h4>
                  <p className="text-on-surface-variant text-sm mt-1">Comprehensive 60-minute assessment.</p>
                </div>
                <span className="absolute top-4 right-4 font-bold text-clinical-navy">$250</span>
              </label>
              <label className={`radio-card p-4 border rounded-xl flex items-start gap-4 cursor-pointer transition-colors relative ${selectedServiceId === 'follow-up-session' ? 'border-clinical-navy bg-surface-container-low' : 'border-surface-gray hover:border-clinical-navy'}`}>
                <input type="radio" name="service" className="mt-1" checked={selectedServiceId === 'follow-up-session'} onChange={() => selectService('follow-up-session')} />
                <div>
                  <h4 className="font-bold text-clinical-navy text-base">Follow-up Session</h4>
                  <p className="text-on-surface-variant text-sm mt-1">30-minute medication or therapy review.</p>
                </div>
                <span className="absolute top-4 right-4 font-bold text-clinical-navy">$125</span>
              </label>
              
              <div className="flex justify-end mt-6">
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Select Date & Time</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((date) => (
                  <button key={date} onClick={() => selectDateTime(date, selectedTime ?? '')} className={`shrink-0 w-20 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${selectedDate === date ? 'bg-clinical-navy text-white border-clinical-navy' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="font-label-md text-xs uppercase">{date.split(' ')[0]}</span>
                    <span className="font-bold text-lg">{date.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['09:00', '10:30', '13:00', '14:30', '16:00'].map((time) => (
                  <button key={time} onClick={() => selectDateTime(selectedDate ?? '', time)} className={`py-2 rounded-lg border font-label-md text-sm transition-colors ${selectedTime === time ? 'bg-evidence-blue-light border-evidence-blue-light text-clinical-navy font-bold' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}>
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">
                  Back
                </button>
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Confirm Details</h3>

              <input type="hidden" {...register('serviceId')} />
              <input type="hidden" {...register('date')} />
              <input type="hidden" {...register('time')} />

              <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Service</span>
                  <span className="font-bold text-clinical-navy text-sm">{serviceLabel}</span>
                </div>
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Date & Time</span>
                  <span className="font-bold text-clinical-navy text-sm">{dateTimeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Total</span>
                  <span className="font-bold text-clinical-navy text-lg">{priceLabel}</span>
                </div>
              </div>

              {(errors.serviceId || errors.date || errors.time) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {errors.serviceId && <p>{errors.serviceId.message}</p>}
                  {errors.date && <p>{errors.date.message}</p>}
                  {errors.time && <p>{errors.time.message}</p>}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">
                  Back
                </button>
                <button type="submit" className="bg-healing-teal text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity shadow-sm">
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.section>
    </div>
  );
}

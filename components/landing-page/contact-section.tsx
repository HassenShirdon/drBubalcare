'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { MiniFaq } from './mini-faq'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactSection() {
  const [status, setStatus] = useState<SubmitState>('idle')

  return (
    <section className="py-20 bg-white border-y border-[#E2E8F0]/50" id="contact">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#3B82F6]">
                Contact
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] text-balance">
                Get in touch
              </h2>
              <p className="font-body-lg text-base text-[#64748B]/85 max-w-md leading-relaxed">
                Have a question about a service, need help with a referral, or want to partner with us?
              </p>
            </div>
            <MiniFaq />
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A5F] flex-shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Email</p>
                  <a href="mailto:care@drbubalcare.com" className="text-base text-[#1E3A5F] hover:text-primary transition-colors">care@drbubalcare.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A5F] flex-shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Phone</p>
                  <a href="tel:+18005551234" className="text-base text-[#1E3A5F] hover:text-primary transition-colors">+1 (800) 555-1234</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A5F] flex-shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Location</p>
                  <p className="text-base text-[#64748B]">Ghent, Belgium — Remote consultations across East Africa</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8 border border-[#E2E8F0]/60 shadow-sm">
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              setStatus('submitting')
              try {
                await fetch('/api/contact', {
                  method: 'POST',
                  body: JSON.stringify({
                    name: data.get('name'),
                    email: data.get('email'),
                    message: data.get('message'),
                  }),
                  headers: { 'Content-Type': 'application/json' },
                })
                form.reset();
                setStatus('success')
              } catch {
                setStatus('error')
              }
            }}>
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-medium text-[#0F172A]">Name</label>
                <input id="contact-name" name="name" type="text" required className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-base placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-medium text-[#0F172A]">Email</label>
                <input id="contact-email" name="email" type="email" required className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-base placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-[#0F172A]">Message</label>
                <textarea id="contact-message" name="message" rows={4} required className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-base placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all resize-none" placeholder="How can we help?" />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-[#1E3A5F] text-white text-base font-medium px-6 py-2.5 rounded-lg hover:bg-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {status === 'submitting' ? 'Sending...' : 'Send message'}
              </button>
              {status === 'success' && (
                <p className="text-base text-emerald-600">Message sent. We typically respond within 4 hours.</p>
              )}
              {status === 'error' && (
                <p className="text-base text-[#B91C1C]">Something went wrong. Please try again or email us directly.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

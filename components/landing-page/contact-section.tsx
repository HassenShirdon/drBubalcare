'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="py-16 bg-white border-y border-surface-gray/50" id="contact">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance">Get in Touch</h2>
            <p className="font-body-lg text-sm text-on-surface-variant/80 max-w-md leading-relaxed">
              Have a question about our services, need help with a referral, or want to partner with us? We&apos;re here to help.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy flex-shrink-0">
                  <Mail className="text-base" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">Email</p>
                  <a href="mailto:care@drbubalcare.com" className="font-body-md text-sm text-clinical-navy hover:text-healing-teal transition-colors">care@drbubalcare.com</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy flex-shrink-0">
                  <Phone className="text-base" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">Phone</p>
                  <a href="tel:+18005551234" className="font-body-md text-sm text-clinical-navy hover:text-healing-teal transition-colors">+1 (800) 555-1234</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy flex-shrink-0">
                  <MapPin className="text-base" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">Location</p>
                  <p className="font-body-md text-sm text-on-surface-variant">Ghent, Belgium — Telehealth &amp; Remote Consultations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-surface-gray/60 shadow">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="font-label-md text-xs font-medium text-clinical-navy">Name</label>
                  <input id="contact-name" type="text" required className="w-full px-3 py-2 rounded-lg border border-surface-gray bg-white text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all" placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="font-label-md text-xs font-medium text-clinical-navy">Email</label>
                  <input id="contact-email" type="email" required className="w-full px-3 py-2 rounded-lg border border-surface-gray bg-white text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="font-label-md text-xs font-medium text-clinical-navy">Subject</label>
                <input id="contact-subject" type="text" required className="w-full px-3 py-2 rounded-lg border border-surface-gray bg-white text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all" placeholder="How can we help?" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="font-label-md text-xs font-medium text-clinical-navy">Message</label>
                <textarea id="contact-message" rows={4} required className="w-full px-3 py-2 rounded-lg border border-surface-gray bg-white text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all resize-none" placeholder="Tell us more..." />
              </div>
              <button type="submit" className="bg-clinical-navy text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all shadow-sm w-full sm:w-auto">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

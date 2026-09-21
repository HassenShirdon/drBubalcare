'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { MiniFaq } from './mini-faq'

export default function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-landing-surface-card border-y border-landing-border/50" id="contact">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text text-balance tracking-tight leading-[1.2]">
                Get in touch
              </h2>
              <p className="text-base text-landing-text-muted max-w-md leading-relaxed">
                Have a question about a service, need help with a referral, or want to partner with us?
              </p>
            </div>
            <MiniFaq />
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-landing-accent flex items-center justify-center text-landing-brand flex-shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-landing-text-faint uppercase tracking-wider font-medium">Email</p>
                  <a href="mailto:care@drbubalcare.com" className="text-sm font-medium text-landing-brand hover:text-landing-brand/80 transition-colors">
                    care@drbubalcare.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-landing-accent flex items-center justify-center text-landing-brand flex-shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-landing-text-faint uppercase tracking-wider font-medium">Phone</p>
                  <a href="tel:+13128471928" className="text-sm font-medium text-landing-brand hover:text-landing-brand/80 transition-colors">
                    +1 (312) 847-1928
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-landing-accent flex items-center justify-center text-landing-brand flex-shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-landing-text-faint uppercase tracking-wider font-medium">Location</p>
                  <p className="text-sm text-landing-text-muted">
                    Ghent, Belgium - Remote consultations across East Africa
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-hairline rounded-2xl p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

function ContactForm() {
  const [formError, setFormError] = useState(false)

  const contactMutation = useMutation({
    mutationFn: async (payload: { name: FormDataEntryValue | null; email: FormDataEntryValue | null; message: FormDataEntryValue | null }) => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Request failed')
    },
    onError: () => setFormError(true),
  })

  const status: SubmitState = contactMutation.isPending
    ? 'submitting'
    : contactMutation.isSuccess
      ? 'success'
      : formError
        ? 'error'
        : 'idle'

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)
        contactMutation.mutate(
          { name: data.get('name'), email: data.get('email'), message: data.get('message') },
          { onSuccess: () => { setFormError(false); form.reset() } },
        )
      }}
    >
      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-medium text-landing-text">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2.5 rounded-xl border border-landing-border bg-landing-surface text-landing-text text-sm placeholder:text-landing-text-faint/50 focus:outline-none focus:ring-2 focus:ring-landing-brand/20 focus:border-landing-brand transition-all"
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium text-landing-text">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2.5 rounded-xl border border-landing-border bg-landing-surface text-landing-text text-sm placeholder:text-landing-text-faint/50 focus:outline-none focus:ring-2 focus:ring-landing-brand/20 focus:border-landing-brand transition-all"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-landing-text">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          className="w-full px-3 py-2.5 rounded-xl border border-landing-border bg-landing-surface text-landing-text text-sm placeholder:text-landing-text-faint/50 focus:outline-none focus:ring-2 focus:ring-landing-brand/20 focus:border-landing-brand transition-all resize-none"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-landing-brand text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto shadow-soft"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-landing-success font-medium">
          Message sent. We typically respond within 4 hours.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-destructive font-medium">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  )
}

/**
 * Strips Protected Health Information (PHI) from text before sending to LLM.
 * Over-strip rather than under-strip — clinical content is preserved, PII is removed.
 */

const PHI_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: "[EMAIL]" },

  // Phone numbers (US/international formats)
  { pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: "[PHONE]" },

  // Dates of birth (MM/DD/YYYY, YYYY-MM-DD, DD.MM.YYYY)
  { pattern: /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](\d{4})\b/g, replacement: "[DOB]" },
  { pattern: /\b(\d{4})[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])\b/g, replacement: "[DOB]" },
  { pattern: /\b(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(\d{4})\b/g, replacement: "[DOB]" },

  // MRN / Patient ID patterns
  { pattern: /\bMRN[#:\s]?\s*\d{6,12}\b/gi, replacement: "[MRN]" },
  { pattern: /\b(?:patient|record|chart|case|file)\s*(?:id|number|#|no)[#:\s]*\d{4,12}\b/gi, replacement: "[MEDICAL_ID]" },

  // Social Security Numbers (US)
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[SSN]" },

  // National ID numbers (Kenya: 8 digits, UK: NHS 10 digits, generic)
  { pattern: /\b\d{8}(?:\/\d{4})?\b/g, replacement: "[NATIONAL_ID]" },

  // Passport numbers (alphanumeric, 6-12 chars)
  { pattern: /\b[A-Z]{1,2}\d{6,9}\b/g, replacement: "[PASSPORT]" },

  // Health insurance numbers
  { pattern: /\b(?:insurance|ins|member|policy|group|card)\s*(?:id|number|#|no)[#:\s]*[A-Z0-9]{4,20}\b/gi, replacement: "[INSURANCE_ID]" },

  // Credit card numbers
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: "[CARD_NUMBER]" },

  // IP addresses
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: "[IP_ADDRESS]" },

  // URLs with personal identifiers (excluding medical context URLs)
  { pattern: /\bhttps?:\/\/[^\s]+(?:id|token|key|auth|patient|user|session)[^\s]*/gi, replacement: "[URL]" },

  // Account / bank numbers
  { pattern: /\b(?:account|acct)\s*(?:number|#|no)[#:\s]*\d{6,20}\b/gi, replacement: "[ACCOUNT_NUMBER]" },

  // US street addresses
  { pattern: /\b\d{1,5}\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Place|Pl|Way|Circle|Cir)\b\.?/gi, replacement: "[ADDRESS]" },
];

export function stripPHI(text: string, context?: { patientName?: string }): string {
  if (!text) return text;

  let stripped = text;

  if (context?.patientName) {
    const nameRegex = new RegExp(escapeRegex(context.patientName), "gi");
    stripped = stripped.replace(nameRegex, "[PATIENT]");
  }

  for (const { pattern, replacement } of PHI_PATTERNS) {
    stripped = stripped.replace(pattern, replacement);
  }

  return stripped;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

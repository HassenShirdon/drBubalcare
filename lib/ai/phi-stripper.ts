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

  // MRN patterns
  { pattern: /\bMRN[#:\s]?\s*\d{6,12}\b/gi, replacement: "[MRN]" },

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

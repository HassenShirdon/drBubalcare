# Task 1: Data Constants — Brief

**Files:** `components/landing-page/data.ts` (new)
**Depends on:** None

Create a constants file exporting:
- `SPECIALIZATIONS` — 10 items: `{ title, description, icon }` (Lucide icon component names)
- `TRUST_POINTS` — 4 items: `{ title, description, icon }`
- `STATS` — 4 items: `{ value, label }`
- `STEPS` — 4 items: `{ num, title, description }`
- `SERVICES` — 4 items: `{ title, description, icon, category }`

Icons imported from `lucide-react`. All copy from design doc.

## Data Values

### SPECIALIZATIONS (10)
1. Hematopathology — "Blood disorders, leukemia, lymphoma diagnosis" — Droplets
2. Clinical Pathology — "Lab medicine, biochemical analysis, diagnostics" — FlaskConical
3. Diagnostic Radiology — "X-ray, CT, MRI interpretation" — ScanLine
4. Fetal Medicine — "Prenatal screening, fetal anomaly assessment" — Baby
5. Cytopathology — "Cell-level analysis, fine needle aspirates" — Microscope
6. Dermatopathology — "Skin biopsy analysis, melanoma screening" — Sun
7. Women's Health — "Gynecological pathology, fertility-related diagnostics" — Heart
8. Pediatrics — "Childhood disease diagnostics, neonatal screening" — Child
9. Oncology — "Cancer staging, tumor classification, treatment monitoring" — Ribbon
10. Chronic Disease — "Diabetes, hypertension, long-term monitoring" — Activity

### TRUST_POINTS (4)
1. Board-certified specialists only — "Every specialist is verified. No exceptions." — BadgeCheck
2. Your data stays private — "HIPAA and GDPR compliant. Files encrypted. AI never sees your name." — Shield
3. Plain-language reports — "No medical jargon. Your report is written as if by a trusted GP." — MessageSquareText
4. 24-48 hour turnaround — "Most cases reviewed within 2 days. Urgent cases get priority." — Clock

### STATS (4)
1. "10+" — "Specialist Disciplines"
2. "24-48h" — "Average Turnaround"
3. "Encrypted" — "Data Security"
4. "East Africa" — "Primary Coverage"

### STEPS (4)
1. "01" — "Upload your records" — "Lab reports, scans, slides — upload anything. Takes under 5 minutes."
2. "02" — "AI matches your specialist" — "Our system reviews your case and routes it to the right board-certified specialist."
3. "03" — "Specialist reviews" — "A qualified specialist reviews your materials alongside an AI pre-screen. Target: 24-48 hours."
4. "04" — "Clear answers delivered" — "You receive a structured report with a plain-language summary. No jargon."

### SERVICES (4)
1. Specialist Opinions — "Submit your records — slides, scans, or lab reports — and receive a written opinion from a board-certified specialist within 24-48 hours." — FileText — "Opinion"
2. Result Interpretation — "Already have test results but don't understand them? Get a clear, plain-language explanation from a qualified specialist." — ClipboardList — "Interpretation"
3. Follow-up Consultations — "After receiving your report, ask questions. Our AI answers within the scope of the opinion, or book a live consultation." — MessageSquareText — "Follow-up"
4. Lab Trend Tracking — "Repeat lab tests tracked over time. AI flags statistically significant changes — an early warning for you and your doctor." — TrendingUp — "Trends"

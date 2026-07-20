# Module 3: Uploading Records

**Role:** Patient
**Duration:** ~10 minutes
**Prerequisites:** Module 2: Your First Case

## Learning Objectives

After completing this module, you will be able to:

1. Upload medical files to your case using supported formats
2. Name files descriptively so specialists can identify them easily
3. Understand how your files are encrypted and protected
4. Manage file size and quantity limits effectively

## Supported File Types

Dr. Bubal Care accepts the most common medical file formats. Choose the format that matches your records.

| File Type | Formats | Examples |
|-----------|---------|----------|
| **Medical images** | JPEG, PNG, TIFF | Histopathology slides, X-rays, ultrasounds, clinical photos |
| **DICOM files** | `.dcm` | CT scans, MRI scans, PET scans |
| **Documents** | PDF, DOCX | Lab reports, clinical notes, referral letters, pathology reports |
| **Lab results** | PDF, CSV | Blood work panels, urinalysis, genetic tests |

If your file is not in one of these formats, you may need to convert it before uploading. Most medical imaging software can export to DICOM or JPEG. Lab results are usually available as PDF from your provider.

> **[PLACEHOLDER: screenshot]** — The supported file types shown on the upload page

## Uploading Files

Uploading your medical records is straightforward. Follow these steps:

1. Open your case and click **"Upload Records"**
2. **Drag and drop** your files into the upload area, or click **"Browse"** to select files from your computer
3. Wait for each file to finish uploading — you will see a green checkmark when complete
4. Files are encrypted automatically before storage (more on this below)
5. Add a note to any file if you want to give the specialist extra context

> **[PLACEHOLDER: screenshot]** — The upload area showing drag-and-drop zone and browse button

### Adding Notes to Files

After uploading a file, you can add a short note. This is optional but helpful.

**Good note example:**
> "This CT scan is from my most recent visit in January 2026. The radiologist at my local hospital flagged a nodule in the upper left lobe."

**When to add a note:**
- The file is one of several similar uploads and you want to clarify which is which
- There is important context the specialist should know about the file
- The file was taken at a specific time that matters for your case

## Naming Files Descriptively

Specialists review many files across multiple cases. Descriptive file names help them work efficiently and avoid confusion.

### Good vs Bad File Names

| Good File Name | Bad File Name | Why |
|---------------|--------------|-----|
| `CBC Results - Jan 2026.pdf` | `file1.pdf` | The good name tells the specialist what test it is and when it was taken |
| `MRI Brain - Feb 2026.dcm` | `scan.dcm` | The good name specifies the body part and date |
| `Pathology Report - Dr. Ahmed.pdf` | `report.pdf` | The good name includes the referring doctor for context |
| `Chest X-Ray - Emergency Visit.pdf` | `xray1.pdf` | The good name describes the occasion and body part |
| `Liver Panel - Jan vs Jun 2026.csv` | `lab.csv` | The good name shows it compares two time points |

**Tips for naming files:**
- Include the **test or scan type** (e.g., "MRI Brain", "CBC Results")
- Include the **date** in a clear format (e.g., "Jan 2026", "Feb 2026")
- Use **plain language** — avoid abbreviations unless they are universally understood
- Separate words with **hyphens or underscores** for readability

> **[PLACEHOLDER: screenshot]** — Upload area showing files with descriptive names

## File Size Limits

Understanding the file limits helps you plan your uploads and avoid frustration.

| Limit | Value | What It Means |
|-------|-------|---------------|
| **Maximum file size** | 50 MB per file | Each individual file must be under 50 MB |
| **Maximum files per case** | 20 files | You can attach up to 20 files to a single case |
| **Total storage** | 500 MB | Your account can store up to 500 MB of records across all cases |

### What If My File Is Too Large?

If a single file exceeds 50 MB, try these steps:

1. **Compress the file** — For images, use lossless compression to reduce file size without losing quality
2. **Export at lower resolution** — For DICOM files, export at a lower resolution if diagnostic quality is not required
3. **Split the file** — If a document contains multiple sections, split it into smaller files (each under 50 MB)
4. **Contact support** — If you have a critical file that cannot be reduced, contact support through the portal

> **[PLACEHOLDER: screenshot]** — Error message when a file exceeds the 50 MB limit

## Security and Encryption

Your medical records contain sensitive information. Dr. Bubal Care uses four layers of security to protect your data at every stage.

### 1. TLS 1.3 — Encryption in Transit

When you upload a file, it travels from your device to our servers over an encrypted connection using **TLS 1.3** — the latest and most secure version of the TLS protocol. This means no one can intercept or read your file while it is being uploaded.

### 2. AES-256 — Encryption at Rest

Once your file reaches our servers, it is encrypted using **AES-256** — a military-grade encryption standard. Your files remain encrypted while stored, so even if someone gained unauthorized access to the storage system, they could not read your files.

### 3. Signed URLs — Controlled Access

When your specialist accesses your files, they use **signed URLs** — temporary, expiring links that work for only 15 minutes. After that, the link stops working and a new one must be generated. This prevents unauthorized access to your records.

### 4. Audit Logging — Access Tracking

Every time someone accesses your files — whether it is you, a specialist, or an admin — the system logs who accessed the file, when, and for what purpose. This audit trail ensures accountability and helps detect any unauthorized access.

### PHI Stripping for AI

Before any AI analysis of your records (such as AI pre-screening), all personally identifiable information is stripped from the data. Your name, date of birth, medical record number, and contact information are removed. Only the clinical content reaches the AI model. This follows the platform's core principle: **"AI surfaces; specialists decide."** AI prepares the clinical content; your identity is always protected.

> **[PLACEHOLDER: screenshot]** — Security indicators on the upload confirmation page

## Practice Scenario

**Scenario:** You have recently received several medical files from your local hospital after a consultation. You want to upload them to a new Specialist Opinion case for a cardiologist to review.

**Your task:**
1. Log in to `patient.drbubalcare.com` and open your case
2. Click **"Upload Records"**
3. Upload the following files with descriptive names:
   - Your echocardiogram DICOM file → name it `Echo - Jan 2026.dcm`
   - Your blood test results PDF → name it `Lipid Panel - Jan 2026.pdf`
   - Your referral letter from your GP → name it `GP Referral Letter - Dr. Smith.pdf`
4. Add a note to the echocardiogram: "Echocardiogram performed at City Hospital. GP noted reduced ejection fraction."
5. Verify all three files show green checkmarks
6. Confirm the total file count and that no file exceeds 50 MB

**Expected outcome:** All three files are uploaded, encrypted, and visible in your case with descriptive names. The specialist will be able to identify each file clearly.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Uploading files with generic names like "file1.pdf" or "scan.dcm" | The specialist cannot tell which file is which without opening each one | Use descriptive names: include the test type and date, e.g., "MRI Brain - Feb 2026.dcm" |
| Uploading a file larger than 50 MB without compressing it | The upload will fail and you will waste time | Check file sizes before uploading; compress large images or split multi-section documents |
| Uploading the same file multiple times | Duplicates waste your 20-file limit and confuse the specialist | Check your uploads before adding more; remove duplicates |
| Including personal details in file notes | Your identity is protected by your account profile — notes should contain clinical context only | Keep notes focused on medical facts: what the file shows, when it was taken, and why it matters |
| Forgetting to add notes when context would help the specialist | The specialist may not know the significance of a file without context | Add brief notes to files that need explanation, especially if the file is one of several similar uploads |

## Knowledge Check

1. **What is the maximum size for a single uploaded file?**
   - A) 25 MB
   - B) 50 MB
   - C) 100 MB
   - D) 500 MB
   - **Correct answer:** B — Each file must be under 50 MB. The 500 MB limit applies to total storage across all your cases, not a single file.

2. **Which of these file names is most helpful for a specialist?**
   - A) `doc1.pdf`
   - B) `lab_results.pdf`
   - C) `CBC Results - Jan 2026.pdf`
   - D) `upload_final_v2.pdf`
   - **Correct answer:** C — The best file names include the test or scan type and the date. This helps the specialist quickly identify what the file contains and when it was taken.

3. **What happens to your personal information before AI analyzes your records?**
   - A) It is shared with the specialist along with the clinical data
   - B) It is stripped — your name, date of birth, and medical record number are removed before any AI processing
   - C) It is stored in the AI model for future reference
   - D) It is encrypted but still visible to the AI
   - **Correct answer:** B — All personally identifiable information (name, DOB, MRN, contact info) is stripped before any LLM call. Only clinical content reaches the AI model. This is part of the platform's PHI-safe prompting policy.

## Summary

In this module, you learned:

- Dr. Bubal Care accepts JPEG, PNG, TIFF, DICOM (`.dcm`), PDF, DOCX, and CSV files
- Drag and drop files or click **"Browse"** to upload — they are encrypted automatically
- Name files descriptively with the test type and date (e.g., "MRI Brain - Feb 2026.dcm")
- File limits: **50 MB per file**, **20 files per case**, **500 MB total** storage
- Your files are protected by **TLS 1.3** in transit, **AES-256** at rest, **signed URLs** for access, and **audit logging** for accountability
- All personal information is stripped before AI analysis — only clinical content is processed

## Next Steps

→ **Module 4: Understanding Reports** — Learn how to read your specialist opinion, interpret the plain-language summary, and understand panel synthesis when multiple specialists review your case.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*

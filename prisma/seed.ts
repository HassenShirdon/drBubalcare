import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
const prisma = new PrismaClient({ adapter });

function mdToTiptap(md: string): string {
  const blocks = md.split("\n\n").filter(Boolean);
  const doc: Record<string, unknown>[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);

    if (lines.length === 1 && /^##\s/.test(lines[0])) {
      doc.push({
        type: "heading",
        attrs: { level: 2 },
        content: [
          { type: "text", text: lines[0].replace(/^##\s+/, "") },
        ],
      });
      continue;
    }

    const content: Record<string, unknown>[] = [];
    for (const line of lines) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const inline: Record<string, unknown>[] = [];
      for (const part of parts) {
        if (part.startsWith("**") && part.endsWith("**")) {
          inline.push({ type: "text", marks: [{ type: "bold" }], text: part.slice(2, -2) });
        } else if (part) {
          inline.push({ type: "text", text: part });
        }
      }
      if (inline.length > 0) {
        if (content.length > 0) {
          content.push({ type: "hardBreak" });
        }
        content.push(...inline);
      }
    }
    if (content.length > 0) {
      doc.push({ type: "paragraph", content });
    }
  }

  return JSON.stringify({ type: "doc", content: doc });
}

async function main() {
  const adminId = crypto.randomUUID();

  const existingAdmin = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "User" WHERE email = $1 LIMIT 1`,
    "admin@drbubalcare.com"
  );

  let adminUserId: string;
  if (existingAdmin.length > 0) {
    adminUserId = existingAdmin[0].id;
    console.log("  ✓ Admin user already exists");
  } else {
    const hash = await bcrypt.hash("admin-secure-password-2024", 12);
    await prisma.$queryRawUnsafe(
      `INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`,
      adminId,
      "Dr. Bubal Care Admin",
      "admin@drbubalcare.com",
      hash,
      "ADMIN",
      new Date().toISOString()
    );
    adminUserId = adminId;
    console.log('  ✓ Admin user created');
  }

  const rawPosts = [
    {
      title: "Why Dr. Bubal Care Exists: The Health System Bridge You've Been Looking For",
      slug: "why-dr-bubal-care-exists",
      excerpt:
        "Long waiting lists, distant specialists, confusing results — Dr. Bubal Care exists to break down the barriers between you and the expert care you deserve.",
      coverImage:
        "https://images.unsplash.com/photo-1758691461932-d0aa0ebf6b31?auto=format&fit=crop&w=1200&q=80",
      md: `## The Hidden Struggles of Getting Expert Care

No one plans to need a specialist. But when you do, the reality can be overwhelming: long waiting lists, specialists hundreds of kilometers away, and lab results full of medical jargon that no one explains in plain language.

These aren't rare problems. They are the everyday experience of patients around the world — and especially in Africa, where fewer than **0.2 specialists exist per 10,000 people** in many regions, compared to over 20 per 10,000 in Europe and North America.

## Why We Built Dr. Bubal Care

Dr. Bubal Care was built on a simple observation: the expertise patients need already exists. What's missing is the bridge between patient and specialist. We are that bridge.

**Direct Specialist Access** — Instead of a waiting list that stretches for months, our platform connects you with board-certified specialists matched to your condition — with written opinions typically delivered within 24-48 hours.

**No Unnecessary Travel** — Many patients spend time and money travelling across borders for answers that could be delivered securely online. We help you get the specialist opinion you need first, and we only advise travel when it is truly necessary.

**Clarity in Plain Language** — A medical report should never feel like a foreign language. Your specialist's opinion arrives with a plain-language summary — written as if explained by a trusted family doctor.

**AI Works Behind the Scenes, Specialists Decide** — Every case is pre-screened by AI to surface key findings and route your case to the right specialist. But the opinion is written, reviewed, and signed by a verified human specialist. Always.

## What Patients Gain

**Peace of Mind** — Instead of wondering, waiting, and worrying, you receive a structured written opinion with clear findings and recommended next steps.

**Second Opinions Without Second Journeys** — If you are unsure about a diagnosis or a treatment plan, you can get a fresh specialist perspective without leaving home.

**A Trusted Record** — Every opinion is stored securely in your portal, forming a clear medical record you can share with your local doctor or an overseas hospital.

## What Specialists Gain

For specialists, Dr. Bubal Care is an opportunity to reach patients who need their expertise but face geographical barriers. AI pre-screening means your time is spent on analysis, not paperwork. You set your availability, and every opinion you sign becomes part of a patient's journey toward better health.

## Our Promise

**Every decision is human.** AI surfaces what matters; a board-certified specialist decides. Every case closes with a human-signed written opinion.

**Transparency is absolute.** You see the price before you pay, you see your records at all times, and you control your data.

**Care is coordinated, not fragmented.** Your local doctor, the remote specialist, and you work from the same understanding of your case.

The technology is not what makes Dr. Bubal Care valuable. What makes it valuable is faster answers, clearer communication, and a system that treats your health as a priority — not a queue number.`,
      category: "Patient Education",
      tags: ["Dr. Bubal Care", "specialist access", "telehealth", "medical care"],
    },
    {
      title: "The Real Advantage of AI in Healthcare: Speed, Clarity, and Safety",
      slug: "ai-advantages-in-healthcare",
      excerpt:
        "AI in healthcare isn't about robots replacing doctors. It's about faster, clearer, and safer care — with a human specialist making every decision.",
      coverImage:
        "https://images.unsplash.com/photo-1767716134786-92b647b12846?auto=format&fit=crop&w=1200&q=80",
      md: `## The Quiet AI Revolution

When people hear "AI in healthcare", they imagine robots and machines replacing doctors. The reality is far more practical — and far more helpful. The most valuable AI in medicine today works quietly behind the scenes, organising information so human specialists can focus on what they do best: making clinical decisions.

At Dr. Bubal Care, we follow one principle above all: **AI surfaces; specialists decide.**

## Advantage 1: Speed Without Sacrificing Quality

Doctors spend a significant portion of their time reading notes, organising records, and identifying what matters most in a case. AI dramatically reduces that time.

**Pre-Screening** — When you upload your records, AI reads the clinical notes, lab results, and prior reports, and produces a structured pre-screen: key findings, possible differentials to consider, and urgent flags. The specialist opens your case already knowing what matters.

**Faster Opinions** — Because the groundwork is done, specialists can deliver thorough written opinions in 24-48 hours instead of days or weeks.

## Advantage 2: Clarity for Patients

Medicine is full of jargon. After a specialist writes their opinion, AI translates it into a plain-language summary — no complex terms, no abbreviations, no guesswork. It reads like a trusted GP explaining things face to face.

## Advantage 3: Coordination Without Mistakes

**Intelligent Case Routing** — AI analyses case metadata — diagnosis type, tissue site, urgency — and matches your case to the right specialist by subspecialty. This eliminates manual triage errors and ensures you reach the right expert the first time.

**Multi-Opinion Synthesis** — When a case is reviewed by a panel of specialists, AI synthesises the areas of agreement and disagreement into a clear consensus summary, so you never have to reconcile conflicting reports alone.

## Advantage 4: Detecting What Time Hides

**Result Trend Analysis** — For patients with repeat lab tests, AI tracks longitudinal trends and flags statistically significant changes over weeks and months. An early-warning signal that might otherwise go unnoticed by the human eye.

## What AI Will Never Do

AI in healthcare has a hard boundary. It never makes a diagnosis. It never signs a case. It is strictly forbidden from offering definitive clinical conclusions.

Every AI output is logged, versioned, auditable, and watermarked as an "AI-Generated Draft." A human specialist reviews every word, and a human sign-off closes every case.

## Why This Matters to You

Faster answers. Clearer explanations. Fewer wasted appointments. A system that spots the important changes while the expert makes the call.

That is the real advantage of AI in healthcare — not replacing the human in the white coat, but making sure you reach them faster and understand their answer better.`,
      category: "Technology",
      tags: ["AI", "healthcare technology", "artificial intelligence", "diagnostics"],
    },
    {
      title: "Africa's Patient-Specialist Gap: Why This Case Must Be Solved Now",
      slug: "africas-patient-specialist-gap",
      excerpt:
        "Millions across Africa face months of waiting and journeys of hundreds of kilometers just to see a specialist. Here's how we bridge that gap.",
      coverImage:
        "https://images.unsplash.com/photo-1576671081741-c538eafccfff?auto=format&fit=crop&w=1200&q=80",
      md: `## The Numbers Behind the Gap

Africa carries more than 25% of the global disease burden but is served by only **3.6% of the world's health workers** — and specialist care is even scarcer.

In many African countries, there are fewer than **0.2 specialists per 10,000 people**, compared to over 20 per 10,000 in Europe and North America. Specialist neurologists, cardiologists, and pathologists are concentrated almost entirely in capital cities, leaving rural and underserved populations with almost no access to expert care.

## The Long Road to a Specialist

For a patient in a rural district, a specialist consultation can mean:

**Distance** — Hundreds of kilometers to the nearest city with a trained specialist, on roads that are often poor and transport that is expensive.

**Cost** — Lost working days, accommodation near the hospital, and transport that the family budget simply cannot absorb.

**Delay** — Waiting lists measured in months; by the time the appointment arrives, the condition may have progressed.

**Wasted Journeys** — Travelling across the border to another country, only to find the specialist lacks your full records, and a follow-up trip is required.

## What Patients in Africa Can't Access

The problem is rarely that patients don't know they are unwell. It is that the right expert is unreachable. For women's health, children's development, oncology, cardiology, and laboratory interpretation, the gap between "who can help" and "who can be reached" decides outcomes.

## Why Dr. Bubal Care Was Built for Africa

We designed Dr. Bubal Care for this reality.

**Records first, results fast** — You upload your slides, scans, or lab reports. AI pre-screening organises your case. A board-certified specialist matched to your condition reviews everything and delivers a written opinion within 24-48 hours — no journey, no queue, no wasted trip.

**Plain-language answers** — Your opinion arrives with a clear, jargon-free summary you can understand, discuss with your family, and share with your local doctor.

**Coordinated care, not isolated visits** — Your specialist's opinion becomes part of your record. Your local doctor, the remote specialist, and overseas hospital (when needed) all work from the same picture.

**Emergency escalation** — If a specialist identifies a critical finding, immediate contact follows — via phone or WhatsApp — not just a portal notification. In urgent cases, getting the right information to the right person is a matter of time, not convenience.

## Closing the Gap Does Not Mean Losing the Human

No AI on the platform diagnoses and no machine signs opinions. **AI surfaces; specialists decide.** Every patient gets a human-signed written opinion from a verified, board-certified doctor.

## The Future We Want to Build

Bridge doctors in African cities with primary care physicians in rural districts. Bring specialist panels within reach of every patient who needs a second opinion. Make lab results understandable in every language and every region.

The case is urgent. The expertise exists. What was missing was the bridge — and that is precisely what Dr. Bubal Care provides.`,
      category: "Patient Education",
      tags: ["Africa", "healthcare access", "specialist care", "patients"],
    },
    {
      title: "Before You Travel Abroad for Treatment: What Every Patient Must Do First",
      slug: "prepare-before-travelling-abroad",
      excerpt:
        "Medical travel is expensive and stressful. Get a specialist opinion before you book — and in many cases, you may not need to travel at all.",
      coverImage:
        "https://images.unsplash.com/photo-1766954828280-9c4d884a8515?auto=format&fit=crop&w=1200&q=80",
      md: `## The Hidden Cost of a Medical Journey

Every year, patients spend small fortunes travelling abroad for treatment — flights, visas, accommodation, meals, and overseas appointments that start at hundreds of dollars each. And all too often, the trip ends the same way: **"We need your full records"** or **"This could have been handled by a specialist at home."**

Before you book a single flight, there are steps that can save you time, money, and heartbreak. We walk our patients through them constantly — this guide is what we tell everyone.

## Step 1: Get a Specialist Opinion Before You Go

The single most important step is the one patients skip most often: **get a written specialist opinion at home first.** This is not paperwork for its own sake. It answers a critical question: is this problem best solved with a journey, or with expertise that can reach you digitally?

Through Dr. Bubal Care, you upload your slides, scans, or lab reports. A board-certified specialist matched to your case reviews them and delivers a written opinion within 24-48 hours — with clinical findings, impression, and recommended next steps.

## Step 2: Build a Complete Medical File

Overseas doctors make decisions from your records. An incomplete file means lost time and duplicated tests abroad. Before you travel, assemble:

**Every lab result and scan** — Including previous imaging and reports, not just the latest one.

**A medication and allergy list** — Current prescriptions, dosages, durations, and any known allergies or reactions.

**Previous diagnoses and treatments** — Surgery history, admission summaries, and letters from prior specialists.

**One clear question** — Write down, in plain language, what you want answered abroad. A focused file gets a focused answer.

## Step 3: Verify the Specialist and the Facility

Assume nothing. Before you commit money to a hospital abroad, verify the specialist is board-certified in the relevant field, the facility is licensed and accredited, and the quoted price includes everything — consultation, tests, procedure, and hidden fees. Ask for the full cost in writing.

## Step 4: When Travel Really Is Necessary, Prepare Systematically

**Confirm scheduling before booking** — Confirm the specialist's availability, the expected timeline, and the documents they need — before you pay for flights and visas.

**Plan for follow-up** — Treatment rarely ends at the airport. Ask how follow-up will work when you return home. With Dr. Bubal Care, follow-up questions and ongoing specialist access continue remotely after delivery of the opinion.

**Carry your records physically and digitally** — Paper folders are lost. Carry a secure digital copy of your medical file.

**Know your emergency path** — If something goes wrong on the trip, who do you contact? Have the plan written down before you depart.

## Step 5: Recognise That Many Cases Do Not Need Travel

Here is the honest truth we share with every patient: **for many conditions, travel is optional.**

If a written specialist opinion, a second opinion, or result interpretation can resolve the question — and for a huge share of cases, it can — the journey to another country is unnecessary. The answer can arrive in 24-48 hours, securely, in your own language, without a passport.

## How Dr. Bubal Care Bridges the Gap

**Before you travel** — Get the specialist opinion that determines whether the trip is necessary at all.

**If you travel** — Arrive with a complete, organised medical file and a documented opinion that overseas specialists can build on — no repetition, no wasted appointments.

**After you return** — Follow up without flying back. Ask questions, get clarifications, and stay connected to specialist guidance from home.

The decision to travel for healthcare should never be made on guesswork. Get the opinion first. Make the decision second. And if the answer can reach you without a journey — let it.

Start by uploading your records to Dr. Bubal Care. That single step may save you the trip, the cost, and the worry.`,
      category: "Patient Education",
      tags: ["medical travel", "preparation", "second opinion", "patient guidance"],
    },
  ];

  const posts = rawPosts.map((p) => ({ ...p, content: mdToTiptap(p.md) }));

  let count = 0;
  for (const post of posts) {
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "Post" WHERE slug = $1 LIMIT 1`,
      post.slug
    );
    if (existing.length > 0) {
      await prisma.$queryRawUnsafe(
        `UPDATE "Post" SET title = $1, excerpt = $2, content = $3, category = $4, tags = $5::text[], "coverImage" = $6, published = true, "publishedAt" = $7, "authorId" = $8, "updatedAt" = $9 WHERE slug = $10`,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.tags,
        post.coverImage ?? null,
        new Date().toISOString(),
        adminUserId,
        new Date().toISOString(),
        post.slug
      );
    } else {
      await prisma.$queryRawUnsafe(
        `INSERT INTO "Post" (id, title, slug, excerpt, content, category, tags, "coverImage", published, "publishedAt", "authorId", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7::text[], $8, true, $9, $10, $11)`,
        crypto.randomUUID(),
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.category,
        post.tags,
        post.coverImage ?? null,
        new Date().toISOString(),
        adminUserId,
        new Date().toISOString()
      );
    }
    count++;
    console.log(`  ✓ "${post.title}"`);
  }

  console.log(`\nSeeded ${count} posts successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

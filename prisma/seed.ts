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
      title: "Understanding Your Lab Results: A Patient's Guide",
      slug: "understanding-lab-results",
      excerpt:
        "Lab results can be confusing. Here's a plain-language guide to help you understand what those numbers and terms really mean.",
      md: `## Why Lab Results Matter

Laboratory tests are one of the most common tools doctors use to assess your health. But the numbers, abbreviations, and reference ranges on your lab report can feel overwhelming.

## Key Things to Look For

**Reference Ranges** — Every lab test has a normal range. Your results are compared against this range. A result outside the range doesn't always mean something is wrong — it's a signal that needs interpretation by a specialist.

**Units of Measurement** — Results may be reported in different units (mg/dL, mmol/L, IU/L). Always check the units before comparing with previous results.

**Trends Over Time** — A single result is a snapshot. What matters more is how your values change over weeks or months.

## When to Seek a Second Opinion

If your results are unclear, or if you've received a diagnosis and want confirmation, a second opinion from a board-certified specialist can provide clarity and peace of mind.

At Dr. Bubal Care, we connect you with specialists who review your records and provide a plain-language written opinion — typically within 24-48 hours.`,
      category: "Patient Education",
      tags: ["lab results", "patient guide", "health literacy"],
    },
    {
      title: "The Role of AI in Modern Diagnostic Medicine",
      slug: "ai-in-diagnostic-medicine",
      excerpt:
        "How artificial intelligence is transforming diagnostic coordination — without replacing the human specialist.",
      md: `## AI as a Tool, Not a Replacement

Artificial intelligence is reshaping healthcare, but its role is often misunderstood. At Dr. Bubal Care, we follow one core principle: **AI surfaces; specialists decide.**

## Where AI Adds Value

**Pre-screening** — Before your case reaches a specialist, AI reads the clinical notes and flags key findings, potential differentials, and urgent indicators. This means the specialist spends less time searching and more time analyzing.

**Plain-Language Summaries** — After a specialist writes their opinion, AI translates complex medical terminology into clear, patient-friendly language — as if explained by a trusted GP.

**Trend Analysis** — For patients with repeat lab tests, AI tracks longitudinal changes and flags statistically significant shifts that might otherwise go unnoticed.

## What AI Does Not Do

AI never makes a diagnosis. It never signs off on a case. Every opinion is written, reviewed, and signed by a board-certified human specialist. The AI-generated draft is clearly watermarked and always requires human approval before delivery.`,
      category: "Technology",
      tags: ["AI", "diagnostics", "healthcare technology"],
    },
    {
      title: "Why a Second Opinion Matters for Your Diagnosis",
      slug: "why-second-opinion-matters",
      excerpt:
        "A second opinion can change the course of your treatment. Here's why seeking one is a sign of strength, not doubt.",
      md: `## The Value of a Fresh Perspective

A diagnosis is one of the most significant moments in your healthcare journey. It shapes your treatment plan, your prognosis, and your peace of mind. But diagnoses can be complex, and even the best specialists can benefit from a colleague's perspective.

## When to Consider a Second Opinion

**Complex or Rare Conditions** — If your diagnosis involves a rare disease or complex pathology, a second opinion from a specialist in that specific field can provide confirmation or alternative insights.

**Treatment Crossroads** — When multiple treatment options exist, a second opinion can help you make a more informed decision about the best path forward.

**Geographical Barriers** — If you live in an area with limited access to specialists, remote second opinions through platforms like Dr. Bubal Care bridge that gap.

## How Dr. Bubal Care Helps

We match you with a board-certified specialist matched to your specific case type. Your records are reviewed, and you receive a structured written opinion with clinical findings, impression, and recommended next steps — all in plain language.`,
      category: "Patient Education",
      tags: ["second opinion", "diagnosis", "patient rights"],
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
        `UPDATE "Post" SET title = $1, excerpt = $2, content = $3, category = $4, tags = $5::text[], published = true, "publishedAt" = $6, "authorId" = $7, "updatedAt" = $8 WHERE slug = $9`,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.tags,
        new Date().toISOString(),
        adminUserId,
        new Date().toISOString(),
        post.slug
      );
    } else {
      await prisma.$queryRawUnsafe(
        `INSERT INTO "Post" (id, title, slug, excerpt, content, category, tags, published, "publishedAt", "authorId", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7::text[], true, $8, $9, $10)`,
        crypto.randomUUID(),
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.category,
        post.tags,
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

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "hassentahirshirdon@gmail.com";
  const password = "Marjaan@2302";
  const name = "Hassen Tahir";

  const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "User" WHERE email = $1 LIMIT 1`,
    email
  );

  if (existing.length > 0) {
    console.log(`  ✗ Admin with email ${email} already exists`);
    return;
  }

  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 12);

  await prisma.$queryRawUnsafe(
    `INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`,
    id,
    name,
    email,
    hash,
    "ADMIN",
    new Date().toISOString()
  );

  console.log(`  ✓ Admin user created successfully`);
  console.log(`    Email: ${email}`);
  console.log(`    Role: ADMIN`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

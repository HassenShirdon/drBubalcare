-- Add age and gender columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "age" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gender" TEXT;

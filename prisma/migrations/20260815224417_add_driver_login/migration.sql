-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "sessionExpiresAt" TIMESTAMP(3),
ADD COLUMN     "sessionToken" TEXT;

-- AlterTable
ALTER TABLE "CharterParty" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pickupAddress" TEXT;

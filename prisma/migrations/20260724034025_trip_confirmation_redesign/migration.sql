/*
  Warnings:

  - Added the required column `contactName` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "arrivalTime" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "departDestinationTime" TEXT,
ADD COLUMN     "departureTime" TEXT,
ADD COLUMN     "eventTime" TEXT,
ADD COLUMN     "mealStop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestConfirmedDate" TIMESTAMP(3),
ADD COLUMN     "requestReceivedDate" TIMESTAMP(3),
ADD COLUMN     "returnToSchoolTime" TEXT,
ADD COLUMN     "tripDetails" TEXT,
ADD COLUMN     "tripType" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Draft';

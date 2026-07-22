/*
  Warnings:

  - You are about to drop the column `plateNumber` on the `Bus` table. All the data in the column will be lost.
  - You are about to drop the column `seating` on the `Bus` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Bus_busNumber_key";

-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "plateNumber",
DROP COLUMN "seating";

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "tripNumber" TEXT NOT NULL,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "charterPartyId" INTEGER NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "passengerCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripAssignment" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "busId" INTEGER NOT NULL,
    "beginningOdometer" INTEGER,
    "endingOdometer" INTEGER,
    "fuelAdded" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_tripNumber_key" ON "Trip"("tripNumber");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_charterPartyId_fkey" FOREIGN KEY ("charterPartyId") REFERENCES "CharterParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAssignment" ADD CONSTRAINT "TripAssignment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAssignment" ADD CONSTRAINT "TripAssignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAssignment" ADD CONSTRAINT "TripAssignment_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[busNumber]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "licensePlate" TEXT,
ADD COLUMN     "seatingCapacity" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Available';

-- CreateIndex
CREATE UNIQUE INDEX "Bus_busNumber_key" ON "Bus"("busNumber");

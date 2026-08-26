-- AlterTable
ALTER TABLE "TripAssignment" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "studentPassengersDeparture" INTEGER,
ADD COLUMN     "studentPassengersReturn" INTEGER,
ADD COLUMN     "totalPassengersDeparture" INTEGER;

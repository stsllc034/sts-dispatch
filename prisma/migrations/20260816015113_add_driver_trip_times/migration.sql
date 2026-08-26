-- AlterTable
ALTER TABLE "TripAssignment" ADD COLUMN     "destinationArrivalTime" TEXT,
ADD COLUMN     "destinationDepartureTime" TEXT,
ADD COLUMN     "driverEndTime" TEXT,
ADD COLUMN     "driverStartTime" TEXT,
ADD COLUMN     "mealStop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mealStopArrivalTime" TEXT,
ADD COLUMN     "mealStopDepartureTime" TEXT,
ADD COLUMN     "pickupDepartureTime" TEXT,
ADD COLUMN     "returnTime" TEXT,
ADD COLUMN     "totalCustomerHours" DOUBLE PRECISION,
ADD COLUMN     "totalDriverHours" DOUBLE PRECISION;

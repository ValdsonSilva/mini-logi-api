-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM (
    'AVAILABLE',
    'IN_TRANSIT',
    'OFFLINE'
);

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM (
    'PENDING',
    'COLLECTED',
    'DELIVERING',
    'DELIVERED',
    'RETURNED'
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey"
        PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" UUID NOT NULL,
    "trackingCode" VARCHAR(8) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "driverId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey"
        PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_history" (
    "id" UUID NOT NULL,
    "deliveryId" UUID NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_history_pkey"
        PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drivers_licenseId_key"
ON "drivers"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_trackingCode_key"
ON "deliveries"("trackingCode");

-- CreateIndex
CREATE INDEX "deliveries_driverId_idx"
ON "deliveries"("driverId");

-- CreateIndex
CREATE INDEX "deliveries_status_idx"
ON "deliveries"("status");

-- CreateIndex
CREATE INDEX "status_history_deliveryId_changedAt_idx"
ON "status_history"("deliveryId", "changedAt");

-- AddForeignKey
ALTER TABLE "deliveries"
ADD CONSTRAINT "deliveries_driverId_fkey"
FOREIGN KEY ("driverId")
REFERENCES "drivers"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history"
ADD CONSTRAINT "status_history_deliveryId_fkey"
FOREIGN KEY ("deliveryId")
REFERENCES "deliveries"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
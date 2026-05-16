/*
  Warnings:

  - You are about to drop the column `customerAddress` on the `orders` table. All the data in the column will be lost.
  - Added the required column `customerCity` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPostalCode` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerStreet` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerAddress",
ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "customerCity" TEXT NOT NULL,
ADD COLUMN     "customerCountry" TEXT NOT NULL DEFAULT 'France',
ADD COLUMN     "customerPostalCode" TEXT NOT NULL,
ADD COLUMN     "customerRelayName" TEXT,
ADD COLUMN     "customerRelayPointId" TEXT,
ADD COLUMN     "customerStreet" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `setId` on the `set_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setVariantId,productVariantId]` on the table `set_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `setVariantId` to the `set_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "set_items" DROP CONSTRAINT "set_items_setId_fkey";

-- DropIndex
DROP INDEX "set_items_setId_productVariantId_key";

-- AlterTable
ALTER TABLE "set_items" DROP COLUMN "setId",
ADD COLUMN     "setVariantId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "set_items_setVariantId_productVariantId_key" ON "set_items"("setVariantId", "productVariantId");

-- AddForeignKey
ALTER TABLE "set_items" ADD CONSTRAINT "set_items_setVariantId_fkey" FOREIGN KEY ("setVariantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

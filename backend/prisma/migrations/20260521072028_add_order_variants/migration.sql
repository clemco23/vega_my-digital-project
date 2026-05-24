/*
  Warnings:

  - You are about to drop the `_OrderVariants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderVariants" DROP CONSTRAINT "_OrderVariants_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderVariants" DROP CONSTRAINT "_OrderVariants_B_fkey";

-- DropTable
DROP TABLE "_OrderVariants";

-- CreateTable
CREATE TABLE "order_variants" (
    "orderId" INTEGER NOT NULL,
    "productVariantId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_variants_pkey" PRIMARY KEY ("orderId","productVariantId")
);

-- AddForeignKey
ALTER TABLE "order_variants" ADD CONSTRAINT "order_variants_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_variants" ADD CONSTRAINT "order_variants_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

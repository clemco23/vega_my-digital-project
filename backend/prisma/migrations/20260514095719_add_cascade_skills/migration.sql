-- DropForeignKey
ALTER TABLE "product_skills" DROP CONSTRAINT "product_skills_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_skills" ADD CONSTRAINT "product_skills_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

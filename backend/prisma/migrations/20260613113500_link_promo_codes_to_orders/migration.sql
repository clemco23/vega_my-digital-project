ALTER TABLE "orders"
ADD COLUMN "subtotalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "promoCodeId" INTEGER;

UPDATE "orders"
SET "subtotalAmount" = "totalAmount";

ALTER TABLE "orders"
ADD CONSTRAINT "orders_promoCodeId_fkey"
FOREIGN KEY ("promoCodeId") REFERENCES "promo_codes"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE INDEX "orders_promoCodeId_idx" ON "orders"("promoCodeId");

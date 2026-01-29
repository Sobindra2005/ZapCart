/*
  Warnings:

  - You are about to drop the column `variantId` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantName` on the `order_items` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "inventory_variantId_key";

-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "variantId",
DROP COLUMN "variantName";

-- CreateEnum
CREATE TYPE "OrderChannel" AS ENUM ('WEBSITE', 'IN_STORE', 'SOCIAL_MEDIA');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "channel" "OrderChannel" NOT NULL DEFAULT 'WEBSITE';

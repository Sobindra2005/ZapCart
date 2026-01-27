/*
  Warnings:

  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "country",
DROP COLUMN "state";

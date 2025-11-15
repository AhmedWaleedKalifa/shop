/*
  Warnings:

  - Added the required column `displayOrder` to the `ProductColor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayOrder` to the `ProductSize` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductImage_displayOrder_key";

-- AlterTable
ALTER TABLE "ProductColor" ADD COLUMN     "displayOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductSize" ADD COLUMN     "displayOrder" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Category_displayOrder_name_idx" ON "Category"("displayOrder", "name");

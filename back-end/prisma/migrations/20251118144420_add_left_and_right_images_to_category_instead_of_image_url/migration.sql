/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "imageUrl",
ADD COLUMN     "leftImage" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dgiproy8s/image/upload/v1763208708/0f4b2b6c-d3c7-4b64-9d55-3497177af7e3_prwkpe.jpg',
ADD COLUMN     "rightImage" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dgiproy8s/image/upload/v1763208708/0f4b2b6c-d3c7-4b64-9d55-3497177af7e3_prwkpe.jpg';

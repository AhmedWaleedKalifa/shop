-- CreateEnum
CREATE TYPE "Position" AS ENUM ('CENTER', 'START', 'END');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "horizontalTextPosition" "Position" NOT NULL DEFAULT 'CENTER',
ADD COLUMN     "verticalTextPosition" "Position" NOT NULL DEFAULT 'CENTER';

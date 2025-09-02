/*
  Warnings:

  - You are about to drop the column `roomCategoryId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `RoomCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Category` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_roomCategoryId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomCategoryId",
ADD COLUMN     "Category" TEXT NOT NULL;

-- DropTable
DROP TABLE "RoomCategory";

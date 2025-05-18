/*
  Warnings:

  - A unique constraint covering the columns `[rowId,columnId]` on the table `BoardCell` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BoardCell_rowId_columnId_key" ON "BoardCell"("rowId", "columnId");

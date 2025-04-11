-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('private', 'public', 'shared');

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "FolderType" NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FolderVisibility" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FolderVisibility_AB_unique" ON "_FolderVisibility"("A", "B");

-- CreateIndex
CREATE INDEX "_FolderVisibility_B_index" ON "_FolderVisibility"("B");

-- AddForeignKey
ALTER TABLE "_FolderVisibility" ADD CONSTRAINT "_FolderVisibility_A_fkey" FOREIGN KEY ("A") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderVisibility" ADD CONSTRAINT "_FolderVisibility_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

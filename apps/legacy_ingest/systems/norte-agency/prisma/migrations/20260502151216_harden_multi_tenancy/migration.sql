/*
  Warnings:

  - Added the required column `tenantId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `JobAllocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobAllocation" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProposalItem" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Document_tenantId_idx" ON "Document"("tenantId");

-- CreateIndex
CREATE INDEX "JobAllocation_tenantId_idx" ON "JobAllocation"("tenantId");

-- CreateIndex
CREATE INDEX "ProposalItem_tenantId_idx" ON "ProposalItem"("tenantId");

-- AddForeignKey
ALTER TABLE "JobAllocation" ADD CONSTRAINT "JobAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

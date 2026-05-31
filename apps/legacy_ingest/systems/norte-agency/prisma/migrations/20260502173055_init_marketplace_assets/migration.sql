-- CreateTable
CREATE TABLE "MarketplaceAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "apiKey" TEXT NOT NULL,
    "totalLeads" INTEGER NOT NULL DEFAULT 0,
    "totalSales" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceAsset_apiKey_key" ON "MarketplaceAsset"("apiKey");

-- CreateIndex
CREATE INDEX "MarketplaceAsset_tenantId_idx" ON "MarketplaceAsset"("tenantId");

-- AddForeignKey
ALTER TABLE "MarketplaceAsset" ADD CONSTRAINT "MarketplaceAsset_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

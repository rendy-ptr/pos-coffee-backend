-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "RewardType" NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER,
    "code" TEXT,
    "expiryDate" TIMESTAMP(3),
    "conditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rewards_title_key" ON "rewards"("title");

-- CreateIndex
CREATE UNIQUE INDEX "rewards_code_key" ON "rewards"("code");

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

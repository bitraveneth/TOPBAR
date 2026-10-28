-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "serial" TEXT,
    "token" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "firstVerifiedAt" TIMESTAMP(3),
    "verificationCount" INTEGER NOT NULL DEFAULT 0,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "batchLabel" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationAttempt" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "codeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationImport" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "inserted" INTEGER NOT NULL,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL,
    "invalid" INTEGER NOT NULL,
    "errorSample" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_serial_key" ON "VerificationCode"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_token_key" ON "VerificationCode"("token");

-- CreateIndex
CREATE INDEX "VerificationCode_batchLabel_idx" ON "VerificationCode"("batchLabel");

-- CreateIndex
CREATE INDEX "VerificationCode_firstVerifiedAt_idx" ON "VerificationCode"("firstVerifiedAt");

-- CreateIndex
CREATE INDEX "VerificationCode_createdAt_idx" ON "VerificationCode"("createdAt");

-- CreateIndex
CREATE INDEX "VerificationAttempt_createdAt_idx" ON "VerificationAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "VerificationAttempt_status_createdAt_idx" ON "VerificationAttempt"("status", "createdAt");

-- CreateIndex
CREATE INDEX "VerificationAttempt_ipHash_createdAt_idx" ON "VerificationAttempt"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "VerificationAttempt_codeId_createdAt_idx" ON "VerificationAttempt"("codeId", "createdAt");

-- CreateIndex
CREATE INDEX "VerificationAttempt_input_idx" ON "VerificationAttempt"("input");

-- AddForeignKey
ALTER TABLE "VerificationAttempt" ADD CONSTRAINT "VerificationAttempt_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "VerificationCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;


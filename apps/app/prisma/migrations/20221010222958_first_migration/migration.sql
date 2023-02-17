-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('WORKSPACE_OWNER', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_TYPE" AS ENUM ('INDIVIDUAL', 'TEAM', 'BROKERAGE');

-- CreateEnum
CREATE TYPE "ShowingStatus" AS ENUM ('NO_STATUS', 'CONFIRMED', 'CANCELED', 'RESCHEDULED', 'PENDING', 'DENIED');

-- CreateEnum
CREATE TYPE "ShowingGroupType" AS ENUM ('SINGLE', 'GROUP');

-- CreateEnum
CREATE TYPE "PersonOnShowingRole" AS ENUM ('Agent', 'Client');

-- CreateTable
CREATE TABLE "PersonOnShowing" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "PersonOnShowingRole" NOT NULL,
    "showingId" TEXT,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "PersonOnShowing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Showing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ShowingStatus" NOT NULL DEFAULT 'NO_STATUS',
    "assignedToId" TEXT,
    "stopNumber" INTEGER NOT NULL,
    "showingGroupId" TEXT NOT NULL,
    "note" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Showing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowingGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "type" "ShowingGroupType" NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ShowingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonMeta" (
    "id" TEXT NOT NULL,
    "socail" JSONB,
    "primaryEmail" TEXT,
    "secondaryEmail" TEXT,
    "primaryPhone" TEXT,
    "secondaryPhone" TEXT,
    "personId" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PersonMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "PersonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Workspace',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMeta" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "WorkspaceMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnWorkspace" (
    "id" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "workspaceId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserOnWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionOnWorkspace" (
    "id" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'INDIVIDUAL',
    "ownerId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubscriptionOnWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "brokerage" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_ShowingToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShowingGroupToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PlaceToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToPersonCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonMeta_personId_key" ON "PersonMeta"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonCategory_title_key" ON "PersonCategory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMeta_workspaceId_key" ON "WorkspaceMeta"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionOnWorkspace_workspaceId_key" ON "SubscriptionOnWorkspace"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_ShowingToTag_AB_unique" ON "_ShowingToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ShowingToTag_B_index" ON "_ShowingToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShowingGroupToTag_AB_unique" ON "_ShowingGroupToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ShowingGroupToTag_B_index" ON "_ShowingGroupToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlaceToTag_AB_unique" ON "_PlaceToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaceToTag_B_index" ON "_PlaceToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToTag_AB_unique" ON "_PersonToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToTag_B_index" ON "_PersonToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToPersonCategory_AB_unique" ON "_PersonToPersonCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToPersonCategory_B_index" ON "_PersonToPersonCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToPlace_AB_unique" ON "_PersonToPlace"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToPlace_B_index" ON "_PersonToPlace"("B");

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_showingId_fkey" FOREIGN KEY ("showingId") REFERENCES "Showing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOnShowing" ADD CONSTRAINT "PersonOnShowing_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "UserOnWorkspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showing" ADD CONSTRAINT "Showing_showingGroupId_fkey" FOREIGN KEY ("showingGroupId") REFERENCES "ShowingGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowingGroup" ADD CONSTRAINT "ShowingGroup_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowingGroup" ADD CONSTRAINT "ShowingGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonMeta" ADD CONSTRAINT "PersonMeta_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCategory" ADD CONSTRAINT "PersonCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMeta" ADD CONSTRAINT "WorkspaceMeta_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnWorkspace" ADD CONSTRAINT "UserOnWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnWorkspace" ADD CONSTRAINT "UserOnWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionOnWorkspace" ADD CONSTRAINT "SubscriptionOnWorkspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionOnWorkspace" ADD CONSTRAINT "SubscriptionOnWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowingToTag" ADD CONSTRAINT "_ShowingToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Showing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowingToTag" ADD CONSTRAINT "_ShowingToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowingGroupToTag" ADD CONSTRAINT "_ShowingGroupToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ShowingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowingGroupToTag" ADD CONSTRAINT "_ShowingGroupToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToTag" ADD CONSTRAINT "_PlaceToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToTag" ADD CONSTRAINT "_PlaceToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToTag" ADD CONSTRAINT "_PersonToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToTag" ADD CONSTRAINT "_PersonToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToPersonCategory" ADD CONSTRAINT "_PersonToPersonCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToPersonCategory" ADD CONSTRAINT "_PersonToPersonCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PersonCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToPlace" ADD CONSTRAINT "_PersonToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToPlace" ADD CONSTRAINT "_PersonToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Progress_profileId_idx" ON "Progress"("profileId");

-- CreateIndex
CREATE INDEX "Progress_trackId_idx" ON "Progress"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_profileId_trackId_moduleId_lessonId_key" ON "Progress"("profileId", "trackId", "moduleId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_profileId_trackId_moduleId_lessonId_key" ON "Bookmark"("profileId", "trackId", "moduleId", "lessonId");

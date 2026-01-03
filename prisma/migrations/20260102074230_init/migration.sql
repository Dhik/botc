-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "script" TEXT NOT NULL DEFAULT 'trouble-brewing',
    "status" TEXT NOT NULL DEFAULT 'lobby',
    "currentPhase" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "dayNumber" INTEGER NOT NULL DEFAULT 0,
    "nightNumber" INTEGER NOT NULL DEFAULT 0,
    "gmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "characterId" TEXT,
    "actualRole" TEXT,
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "hasUsedGhostVote" BOOLEAN NOT NULL DEFAULT false,
    "seatNumber" INTEGER NOT NULL,
    "isGM" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "script" TEXT NOT NULL DEFAULT 'trouble-brewing',
    "ability" TEXT NOT NULL,
    "firstNight" INTEGER,
    "otherNights" INTEGER,
    "setup" TEXT,
    "reminders" JSONB NOT NULL DEFAULT '[]',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingSession" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "nominatedPlayerId" TEXT NOT NULL,
    "nominatorPlayerId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "VotingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "votingSessionId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isGhostVote" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Information" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "infoType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrimoireState" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "tokens" JSONB NOT NULL DEFAULT '[]',
    "reminders" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrimoireState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_roomCode_key" ON "Game"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_seatNumber_key" ON "Player"("gameId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Character_characterId_key" ON "Character"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_votingSessionId_voterId_key" ON "Vote"("votingSessionId", "voterId");

-- CreateIndex
CREATE UNIQUE INDEX "GrimoireState_gameId_key" ON "GrimoireState"("gameId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingSession" ADD CONSTRAINT "VotingSession_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votingSessionId_fkey" FOREIGN KEY ("votingSessionId") REFERENCES "VotingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrimoireState" ADD CONSTRAINT "GrimoireState_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

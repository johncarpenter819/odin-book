-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);


-- Add speech fields to meeting_registration table
ALTER TABLE "meeting_registration" ADD COLUMN "speech_title" varchar(255);
ALTER TABLE "meeting_registration" ADD COLUMN "speech_objectives" text;

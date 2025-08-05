-- Add status column to announcements table
ALTER TABLE "announcements" ADD COLUMN "status" varchar(20) DEFAULT 'draft';

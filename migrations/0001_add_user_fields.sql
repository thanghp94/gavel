
-- Add new columns to users table
ALTER TABLE "users" ADD COLUMN "full_name" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "date_of_birth" varchar(20);
ALTER TABLE "users" ADD COLUMN "school" varchar(255);
ALTER TABLE "users" ADD COLUMN "gender" varchar(20);

-- Update existing users to have full_name same as display_name
UPDATE "users" SET "full_name" = "display_name" WHERE "full_name" = '';

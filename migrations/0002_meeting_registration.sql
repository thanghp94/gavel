
-- Drop the attendance table
DROP TABLE IF EXISTS "attendance";

-- Create the meeting_registration table
CREATE TABLE "meeting_registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid,
	"date_registered" timestamp with time zone DEFAULT now(),
	"attendance_status" varchar(20) DEFAULT 'registered'
);

-- Add foreign key constraints
ALTER TABLE "meeting_registration" ADD CONSTRAINT "meeting_registration_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "meeting_registration" ADD CONSTRAINT "meeting_registration_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "meeting_registration" ADD CONSTRAINT "meeting_registration_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE set null ON UPDATE no action;

import type { Express } from "express";
import { insertMeetingSchema } from "@shared/schema";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";

export function registerMeetingRoutes(app: Express) {
  // Get all meetings
  app.get("/api/meetings", authenticateToken, async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  // Create meeting (ExCo only)
  app.post("/api/meetings", authenticateToken, requireExco, async (req, res) => {
    try {
      const meetingData = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(meetingData);
      res.json(meeting);
    } catch (error) {
      res.status(400).json({ message: "Failed to create meeting" });
    }
  });

  // Get specific meeting
  app.get("/api/meetings/:id", authenticateToken, async (req, res) => {
    try {
      const meeting = await storage.getMeeting(req.params.id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meeting" });
    }
  });

  // Update meeting (ExCo only)
  app.put('/api/meetings/:id', authenticateToken, requireExco, async (req, res) => {
    try {
      const meetingId = req.params.id;
      const meetingData = insertMeetingSchema.parse(req.body);

      const updatedMeeting = await storage.updateMeeting(meetingId, meetingData);

      if (!updatedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }

      res.json(updatedMeeting);
    } catch (error) {
      console.error('Error updating meeting:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Register for meeting
  app.post("/api/meetings/:meetingId/register", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const { meetingId } = req.params;
      const { roleId, speechTitle, speechObjectives } = req.body;

      // Check if user already registered
      const existing = await storage.getUserMeetingRegistration(user.id, meetingId);
      if (existing) {
        return res.status(400).json({ message: "Already registered for this meeting" });
      }

      const registration = await storage.registerForMeeting(user.id, meetingId, roleId, speechTitle, speechObjectives);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to register for meeting" });
    }
  });

  // Update meeting registration
  app.put("/api/meetings/:meetingId/register", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const { meetingId } = req.params;
      const { roleId, speechTitle, speechObjectives } = req.body;

      // Check if user is registered
      const existing = await storage.getUserMeetingRegistration(user.id, meetingId);
      if (!existing) {
        return res.status(404).json({ message: "Registration not found" });
      }

      const registration = await storage.updateMeetingRegistration(existing.id, roleId, speechTitle, speechObjectives);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to update meeting registration" });
    }
  });

  // Get meeting registrations (ExCo only)
  app.get("/api/meetings/:meetingId/registrations", authenticateToken, requireExco, async (req, res) => {
    try {
      console.log('Fetching registrations for meeting:', req.params.meetingId);
      const registrations = await storage.getMeetingRegistrations(req.params.meetingId);
      console.log('Successfully fetched registrations:', registrations.length);
      res.json(registrations);
    } catch (error) {
      console.error('Error in registrations endpoint:', error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  // Get user's registration for meeting
  app.get("/api/meetings/:meetingId/my-registration", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const registration = await storage.getUserMeetingRegistration(user.id, req.params.meetingId);
      res.json(registration || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registration" });
    }
  });

  // Update attendance status (ExCo only)
  app.put("/api/registrations/:registrationId/attendance", authenticateToken, requireExco, async (req, res) => {
    try {
      const { status } = req.body;
      const registration = await storage.updateAttendanceStatus(req.params.registrationId, status);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to update attendance" });
    }
  });

  // Add attendee to meeting (ExCo only)
  app.post("/api/meetings/:meetingId/add-attendee", authenticateToken, requireExco, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const { userId, roleId } = req.body;

      // Check if user already registered
      const existing = await storage.getUserMeetingRegistration(userId, meetingId);
      if (existing) {
        return res.status(400).json({ message: "User already registered for this meeting" });
      }

      const registration = await storage.registerForMeeting(userId, meetingId, roleId);
      res.json(registration);
    } catch (error) {
      console.error("Add attendee error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to add attendee" });
    }
  });
}

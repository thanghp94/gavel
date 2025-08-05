import type { Express } from "express";
import { insertMeetingReportSchema } from "@shared/schema";
import { storage } from "../storage";
import { authenticateToken } from "../middleware/auth";

export function registerReportRoutes(app: Express) {
  // Create meeting report
  app.post("/api/meetings/:meetingId/reports", authenticateToken, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const reportData = req.body;
      const user = (req as any).user;

      // Convert empty strings to null for time fields
      const processedData = {
        ...reportData,
        timeUsed: reportData.timeUsed === "" || reportData.timeUsed === undefined ? null : reportData.timeUsed,
        createdBy: user.id,
      };

      console.log('Processed meeting report data:', JSON.stringify(processedData, null, 2));

      // Validate the report data
      const validatedData = insertMeetingReportSchema.parse(processedData);

      const report = await storage.createMeetingReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error('Error creating meeting report:', error);
      res.status(400).json({ message: "Failed to create meeting report" });
    }
  });

  // Get meeting reports
  app.get("/api/meetings/:meetingId/reports", authenticateToken, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const reports = await storage.getMeetingReports(meetingId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching meeting reports:', error);
      res.status(500).json({ message: "Failed to fetch meeting reports" });
    }
  });

  // Get participant reports
  app.get("/api/participants/:meetingRegistrationId/reports", authenticateToken, async (req, res) => {
    try {
      const { meetingRegistrationId } = req.params;
      const reports = await storage.getParticipantReports(meetingRegistrationId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching participant reports:', error);
      res.status(500).json({ message: "Failed to fetch participant reports" });
    }
  });
}

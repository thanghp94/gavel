import type { Express } from "express";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";

export function registerAnnouncementRoutes(app: Express) {
  // Get all announcements
  app.get("/api/announcements", authenticateToken, async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  // Create announcement (ExCo only)
  app.post("/api/announcements", authenticateToken, requireExco, async (req, res) => {
    try {
      const user = (req as any).user;
      const { title, content, status = "draft" } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: "Missing title or content" });
      }
      const announcementData = {
        title,
        content,
        status,
        createdBy: user.id,
      };
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Update announcement (ExCo only)
  app.put("/api/announcements/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, status } = req.body;
      const announcement = await storage.updateAnnouncement(id, { title, content, status });
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ message: "Failed to update announcement" });
    }
  });

  // Delete announcement (ExCo only)
  app.delete("/api/announcements/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ message: "Failed to delete announcement" });
    }
  });
}

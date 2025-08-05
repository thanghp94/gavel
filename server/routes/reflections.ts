import type { Express } from "express";
import { insertReflectionSchema } from "@shared/schema";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";

export function registerReflectionRoutes(app: Express) {
  // Create reflection
  app.post("/api/reflections", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const reflectionData = insertReflectionSchema.parse({
        ...req.body,
        userId: user.id
      });

      // Check if user already submitted reflection for this meeting
      const existing = await storage.getUserReflection(user.id, reflectionData.meetingId);
      if (existing) {
        return res.status(400).json({ message: "Reflection already submitted for this meeting" });
      }

      const reflection = await storage.createReflection(reflectionData);
      res.json(reflection);
    } catch (error) {
      res.status(400).json({ message: "Failed to create reflection" });
    }
  });

  // Get reflections for a meeting (ExCo only)
  app.get("/api/reflections/meeting/:meetingId", authenticateToken, requireExco, async (req, res) => {
    try {
      const reflections = await storage.getReflections(req.params.meetingId);
      res.json(reflections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  // Get user's reflection for a meeting
  app.get("/api/reflections/my/:meetingId", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const reflection = await storage.getUserReflection(user.id, req.params.meetingId);
      res.json(reflection || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflection" });
    }
  });

  // Get all reflections
  app.get("/api/reflections", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // If user is ExCo, return all reflections for dashboard stats
      if (user.role === 'exco') {
        const allReflections = await storage.getAllReflections();
        res.json(allReflections);
      } else {
        // For regular users, return only their reflections
        const reflections = await storage.getUserReflections(user.id);
        res.json(reflections);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });
}

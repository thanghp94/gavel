import type { Express } from "express";
import { storage } from "../storage";
import { authenticateToken } from "../middleware/auth";

export function registerRoleRoutes(app: Express) {
  // Get all roles
  app.get("/api/roles", authenticateToken, async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });
}

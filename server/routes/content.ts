import type { Express } from "express";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export function registerContentRoutes(app: Express) {
  // Get content page by slug (public, but unpublished pages require ExCo access)
  app.get("/api/content/:slug", async (req, res) => {
    try {
      const page = await storage.getContentPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      // Check if page is published or if user is authenticated as ExCo for preview
      if (!page.isPublished) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await storage.getUser(decoded.userId);

            if (!user || user.role !== 'exco') {
              return res.status(404).json({ message: "Page not found" });
            }
          } catch (error) {
            return res.status(404).json({ message: "Page not found" });
          }
        } else {
          return res.status(404).json({ message: "Page not found" });
        }
      }

      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Get all content pages (ExCo only)
  app.get("/api/content", authenticateToken, requireExco, async (req, res) => {
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Create content page (ExCo only)
  app.post("/api/content", authenticateToken, requireExco, async (req, res) => {
    try {
      const page = await storage.createContentPage(req.body);
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Failed to create page" });
    }
  });

  // Update content page (ExCo only)
  app.put("/api/content/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const page = await storage.updateContentPage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Failed to update page" });
    }
  });

  // Delete content page (ExCo only)
  app.delete("/api/content/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const success = await storage.deleteContentPage(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete page" });
    }
  });
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./auth";
import { registerUserRoutes } from "./users";
import { registerMeetingRoutes } from "./meetings";
import { registerReflectionRoutes } from "./reflections";
import { registerContentRoutes } from "./content";
import { registerTaskRoutes } from "./tasks";
import { registerReportRoutes } from "./reports";
import { registerAnnouncementRoutes } from "./announcements";
import { registerRoleRoutes } from "./roles";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerMeetingRoutes(app);
  registerReflectionRoutes(app);
  registerContentRoutes(app);
  registerTaskRoutes(app);
  registerReportRoutes(app);
  registerAnnouncementRoutes(app);
  registerRoleRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}

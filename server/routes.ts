import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertMeetingSchema, insertReflectionSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is ExCo
const requireExco = (req: any, res: any, next: any) => {
  if (req.user.role !== 'exco') {
    return res.status(403).json({ message: 'ExCo access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, displayName, fullName, dateOfBirth, school, gender } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const userData = insertUserSchema.parse({
        email,
        passwordHash,
        displayName,
        fullName,
        dateOfBirth: dateOfBirth || null,
        school: school || null,
        gender: gender || null,
        role: "member"
      });

      const user = await storage.createUser(userData);

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName,
          fullName: user.fullName,
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/me", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    res.json({ 
      id: user.id, 
      email: user.email, 
      displayName: user.displayName, 
      role: user.role 
    });
  });

  app.get("/api/users", authenticateToken, requireExco, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authenticateToken, requireExco, async (req, res) => {
    try {
      const { email, displayName, fullName, school, gender, role = "member" } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate a temporary password for new users
      const tempPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const userData = insertUserSchema.parse({
        email,
        passwordHash,
        displayName,
        fullName: fullName || displayName,
        school: school || null,
        gender: gender || null,
        role
      });

      const user = await storage.createUser(userData);

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName,
          fullName: user.fullName,
          role: user.role 
        },
        tempPassword 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id/role", authenticateToken, requireExco, async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;

      const updatedUser = await storage.updateUserRole(userId, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        user: { 
          id: updatedUser.id, 
          email: updatedUser.email, 
          displayName: updatedUser.displayName,
          fullName: updatedUser.fullName,
          role: updatedUser.role 
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to update user role" });
    }
  });

  // Meeting routes
  app.get("/api/meetings", authenticateToken, async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", authenticateToken, requireExco, async (req, res) => {
    try {
      const meetingData = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(meetingData);
      res.json(meeting);
    } catch (error) {
      res.status(400).json({ message: "Failed to create meeting" });
    }
  });

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

  // Role routes
  app.get("/api/roles", authenticateToken, async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  // Reflection routes
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

  app.get("/api/reflections/meeting/:meetingId", authenticateToken, requireExco, async (req, res) => {
    try {
      const reflections = await storage.getReflections(req.params.meetingId);
      res.json(reflections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  app.get("/api/reflections/my/:meetingId", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const reflection = await storage.getUserReflection(user.id, req.params.meetingId);
      res.json(reflection || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflection" });
    }
  });

  // Content page routes (CMS)
  app.get("/api/content/:slug", async (req, res) => {
    try {
      const page = await storage.getContentPageBySlug(req.params.slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.get("/api/content", authenticateToken, requireExco, async (req, res) => {
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.post("/api/content", authenticateToken, requireExco, async (req, res) => {
    try {
      const page = await storage.createContentPage(req.body);
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Failed to create page" });
    }
  });

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

  const httpServer = createServer(app);
  return httpServer;
}
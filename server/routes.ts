import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertMeetingSchema, insertReflectionSchema, insertMeetingReportSchema, insertTeamSchema, insertTaskSchema } from "@shared/schema";

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

    // Update meeting
  app.put('/api/meetings/:id', authenticateToken, async (req, res) => {
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

  // Meeting registration routes
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

  app.get("/api/meetings/:meetingId/registrations", authenticateToken, requireExco, async (req, res) => {
    try {
      const registrations = await storage.getMeetingRegistrations(req.params.meetingId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.get("/api/meetings/:meetingId/my-registration", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const registration = await storage.getUserMeetingRegistration(user.id, req.params.meetingId);
      res.json(registration || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registration" });
    }
  });

  app.put("/api/registrations/:registrationId/attendance", authenticateToken, requireExco, async (req, res) => {
    try {
      const { status } = req.body;
      const registration = await storage.updateAttendanceStatus(req.params.registrationId, status);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to update attendance" });
    }
  });

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
      res.status(400).json({ message: error.message || "Failed to add attendee" });
    }
  });

  // Add attendee to meeting
  app.post('/api/meetings/:meetingId/add-attendee', authenticateToken, requireExco, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const { userId, roleId } = req.body;

      const registration = await storage.registerForMeeting(userId, meetingId, roleId);
      res.json(registration);
    } catch (error) {
      console.error('Error adding attendee:', error);
      res.status(400).json({ error: 'Failed to add attendee' });
    }
  });

  // Get meeting registrations
  app.get('/api/meetings/:meetingId/registrations', authenticateToken, requireExco, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const registrations = await storage.getMeetingRegistrations(meetingId);
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  });

  // Update participant role
  app.put('/api/registrations/:registrationId/role', authenticateToken, requireExco, async (req, res) => {
    try {
      const { registrationId } = req.params;
      const { roleId } = req.body;

      const result = await storage.updateRegistrationRole(registrationId, roleId);
      res.json(result);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(400).json({ error: 'Failed to update role' });
    }
  });

  // Meeting report routes
  app.post("/api/meetings/:meetingId/reports", authenticateToken, async (req, res) => {
    try {
      const { meetingId } = req.params;
      const reportData = req.body;
      const user = (req as any).user;

      // Validate the report data
      const validatedData = insertMeetingReportSchema.parse({
        ...reportData,
        createdBy: user.id,
      });

      const report = await storage.createMeetingReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error('Error creating meeting report:', error);
      res.status(400).json({ message: "Failed to create meeting report" });
    }
  });

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

  app.get("/api/participants/:participationId/reports", authenticateToken, async (req, res) => {
    try {
      const { participationId } = req.params;
      const reports = await storage.getParticipantReports(participationId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching participant reports:', error);
      res.status(500).json({ message: "Failed to fetch participant reports" });
    }
  });

  // Team routes
  app.get("/api/teams", authenticateToken, async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", authenticateToken, requireExco, async (req, res) => {
    try {
      const user = (req as any).user;
      const teamData = insertTeamSchema.parse({
        ...req.body,
        leaderId: user.id,
      });
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.get("/api/teams/:teamId/members", authenticateToken, async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.teamId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Task routes
  app.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const { teamId } = req.query;
      const tasks = await storage.getTasks(teamId as string);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Team routes
  app.get("/api/teams", authenticateToken, async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const teamData = insertTeamSchema.parse({
        ...req.body,
        leaderId: user.id,
      });
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.get("/api/teams/:teamId/members", authenticateToken, async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.teamId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Task routes
  app.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const teamId = req.query.teamId as string;
      const tasks = await storage.getTasks(teamId);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const taskData = insertTaskSchema.parse({
        ...req.body,
        createdBy: user.id,
      });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:taskId", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const task = await storage.updateTask(req.params.taskId, updates);
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
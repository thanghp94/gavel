import type { Express } from "express";
import { insertTaskSchema, insertTeamSchema } from "@shared/schema";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";

export function registerTaskRoutes(app: Express) {
  // Get all tasks
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

  // Create task (ExCo only)
  app.post("/api/tasks", authenticateToken, requireExco, async (req, res) => {
    try {
      console.log('=== Task Creation Debug ===');
      const user = (req as any).user;
      console.log('Authenticated user:', { id: user?.id, email: user?.email, role: user?.role });
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const taskDataWithUser = {
        ...req.body,
        createdBy: user.id
      };
      console.log('Task data with createdBy:', JSON.stringify(taskDataWithUser, null, 2));
      
      const taskData = insertTaskSchema.parse(taskDataWithUser);
      console.log('Parsed task data:', JSON.stringify(taskData, null, 2));
      
      const task = await storage.createTask(taskData);
      console.log('Created task:', JSON.stringify(task, null, 2));
      
      res.json(task);
    } catch (error) {
      console.error('=== Task Creation Error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      if (error && typeof error === 'object' && 'issues' in error) {
        console.error('Validation issues:', JSON.stringify((error as any).issues, null, 2));
      }
      res.status(400).json({ 
        message: "Failed to create task",
        error: error instanceof Error ? error.message : 'Unknown error',
        details: (error && typeof error === 'object' && 'issues' in error) ? (error as any).issues : null
      });
    }
  });

  // Update task (ExCo only)
  app.put("/api/tasks/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const taskId = req.params.id;
      const updates = req.body;
      const task = await storage.updateTask(taskId, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  // Delete task (ExCo only)
  app.delete("/api/tasks/:id", authenticateToken, requireExco, async (req, res) => {
    try {
      const taskId = req.params.id;
      const success = await storage.deleteTask(taskId);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(400).json({ message: "Failed to delete task" });
    }
  });

  // Get all teams
  app.get("/api/teams", authenticateToken, async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  // Create team (ExCo only)
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

  // Get team members
  app.get("/api/teams/:teamId/members", authenticateToken, async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.teamId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
}

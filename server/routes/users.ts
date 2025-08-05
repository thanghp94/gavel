import type { Express } from "express";
import { insertUserSchema } from "@shared/schema";
import { storage } from "../storage";
import { authenticateToken, requireExco } from "../middleware/auth";
import bcrypt from "bcryptjs";

export function registerUserRoutes(app: Express) {
  // Get current user
  app.get("/api/users/me", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    res.json({ 
      id: user.id, 
      email: user.email, 
      displayName: user.displayName, 
      role: user.role 
    });
  });

  // Get all users (ExCo only)
  app.get("/api/users", authenticateToken, requireExco, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create new user (ExCo only)
  app.post("/api/users", authenticateToken, requireExco, async (req, res) => {
    try {
      const { email, fullName, dateOfBirth, school, gender, phone, password, role = "member" } = req.body;

      // Check if user already exists and email is provided
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
      }

      // Use provided password or generate a temporary one
      const tempPassword = password || Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      // Use fullName as displayName if not provided
      const displayName = fullName || "Member";

      const userData = {
        email: email || `user${Date.now()}@temp.local`, // Generate temp email if not provided
        passwordHash,
        displayName,
        fullName: fullName || displayName,
        dateOfBirth: dateOfBirth || null,
        school: school || null,
        gender: gender || null,
        phone: phone || null,
        role
      };

      const user = await storage.createUser(userData);

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          displayName: user.displayName,
          fullName: user.fullName,
          role: user.role 
        },
        tempPassword: password ? undefined : tempPassword // Only return temp password if we generated one
      });
    } catch (error) {
      console.error('User creation error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create user" });
    }
  });

  // Update user role (ExCo only)
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
}

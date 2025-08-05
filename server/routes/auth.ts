import type { Express } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema } from "@shared/schema";
import { storage } from "../storage";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export function registerAuthRoutes(app: Express) {
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

      // Create user data
      const userData = {
        email,
        passwordHash,
        displayName,
        fullName,
        dateOfBirth: dateOfBirth || null,
        school: school || null,
        gender: gender || null,
        role: "member"
      };

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
      console.log("Login attempt for:", email);

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("User found:", user.email, "Role:", user.role);

      // Check password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        console.log("Invalid password for:", email);
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
}

import { pgTable, text, uuid, boolean, timestamp, time, date, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  school: varchar("school", { length: 255 }),
  gender: varchar("gender", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  isActive: boolean("is_active").default(true),
});

// Meetings table
export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  theme: varchar("theme", { length: 255 }),
  location: varchar("location", { length: 255 }),
  status: varchar("status", { length: 50 }).default("upcoming"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Roles table (master list)
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Role content table (scripts/guidelines)
export const roleContent = pgTable("role_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  language: varchar("language", { length: 10 }).default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Meeting roles table (junction table)
export const meetingRoles = pgTable("meeting_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  speechTitle: varchar("speech_title", { length: 255 }),
  speechObjectives: text("speech_objectives"),
});

// Meeting registration table (includes meeting roles functionality)
export const meetingRegistration = pgTable("meeting_registration", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "set null" }),
  dateRegister: timestamp("date_register", { withTimezone: true }).defaultNow(),
  attendanceStatus: varchar("attendance_status", { length: 20 }).default("registered"),
  speechTitle: varchar("speech_title", { length: 255 }),
  speechObjectives: text("speech_objectives"),
});

// Speech log table (linked to meeting registration)
export const speechLog = pgTable("speech_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  speechName: varchar("speech_name", { length: 255 }).notNull(),
  userSpeechNumber: varchar("user_speech_number", { length: 50 }),
  speechOrder: varchar("speech_order", { length: 50 }),
  createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Reflections table
export const reflections = pgTable("reflections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
  nameInput: varchar("name_input", { length: 255 }).notNull(),
  q1: text("q1").notNull(),
  q2: text("q2").notNull(),
  q3: text("q3").notNull(),
  q4: text("q4").notNull(),
  q5: text("q5").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow(),
});

// Content pages table (CMS)
export const contentPages = pgTable("content_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").default(""), // Legacy field for simple content
  blocks: json("blocks").default([]), // Rich content blocks for new editor
  status: varchar("status", { length: 20 }).default("draft"), // draft, published
  isPublished: boolean("is_published").default(false),
  lastModified: varchar("last_modified", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Learning materials table
export const learningMaterials = pgTable("learning_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"),
  materialType: varchar("material_type", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertMeetingSchema = createInsertSchema(meetings);
export const insertReflectionSchema = createInsertSchema(reflections);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Role = typeof roles.$inferSelect;
export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;
export type ContentPage = typeof contentPages.$inferSelect;
export type SpeechLog = typeof speechLog.$inferSelect;
export type InsertSpeechLog = typeof speechLog.$inferInsert;
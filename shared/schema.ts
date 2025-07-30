import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resumes table
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal information
export const personalInfo = pgTable("personal_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  fullName: varchar("full_name"),
  email: varchar("email"),
  phone: varchar("phone"),
  location: varchar("location"),
  website: varchar("website"),
  linkedin: varchar("linkedin"),
  github: varchar("github"),
  summary: text("summary"),
});

// Work experience
export const workExperience = pgTable("work_experience", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  jobTitle: varchar("job_title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location"),
  startMonth: integer("start_month").notNull(),
  startYear: integer("start_year").notNull(),
  endMonth: integer("end_month"),
  endYear: integer("end_year"),
  isPresent: boolean("is_present").default(false),
  description: text("description"),
  achievements: text("achievements").array(),
  order: integer("order").default(0),
});

// Education
export const education = pgTable("education", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  institution: varchar("institution").notNull(),
  degree: varchar("degree").notNull(),
  fieldOfStudy: varchar("field_of_study"),
  startMonth: integer("start_month").notNull(),
  startYear: integer("start_year").notNull(),
  endMonth: integer("end_month"),
  endYear: integer("end_year"),
  isPresent: boolean("is_present").default(false),
  gpa: decimal("gpa"),
  achievements: text("achievements").array(),
  order: integer("order").default(0),
});

// Skills
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  name: varchar("name").notNull(),
  category: varchar("category"),
  proficiency: integer("proficiency").default(3),
  order: integer("order").default(0),
});

// Job descriptions for analysis
export const jobDescriptions = pgTable("job_descriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  company: varchar("company"),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume versions for tracking
export const resumeVersions = pgTable("resume_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  version: integer("version").notNull(),
  pdfUrl: varchar("pdf_url"),
  matchScore: decimal("match_score"),
  jobDescriptionId: varchar("job_description_id").references(() => jobDescriptions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI suggestions
export const aiSuggestions = pgTable("ai_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  section: varchar("section").notNull(),
  suggestion: text("suggestion").notNull(),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  jobDescriptions: many(jobDescriptions),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  personalInfo: one(personalInfo),
  workExperience: many(workExperience),
  education: many(education),
  skills: many(skills),
  versions: many(resumeVersions),
  suggestions: many(aiSuggestions),
}));

export const personalInfoRelations = relations(personalInfo, ({ one }) => ({
  resume: one(resumes, {
    fields: [personalInfo.resumeId],
    references: [resumes.id],
  }),
}));

export const workExperienceRelations = relations(workExperience, ({ one }) => ({
  resume: one(resumes, {
    fields: [workExperience.resumeId],
    references: [resumes.id],
  }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  resume: one(resumes, {
    fields: [education.resumeId],
    references: [resumes.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  resume: one(resumes, {
    fields: [skills.resumeId],
    references: [resumes.id],
  }),
}));

export const jobDescriptionsRelations = relations(jobDescriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [jobDescriptions.userId],
    references: [users.id],
  }),
  versions: many(resumeVersions),
}));

export const resumeVersionsRelations = relations(resumeVersions, ({ one }) => ({
  resume: one(resumes, {
    fields: [resumeVersions.resumeId],
    references: [resumes.id],
  }),
  jobDescription: one(jobDescriptions, {
    fields: [resumeVersions.jobDescriptionId],
    references: [jobDescriptions.id],
  }),
}));

export const aiSuggestionsRelations = relations(aiSuggestions, ({ one }) => ({
  resume: one(resumes, {
    fields: [aiSuggestions.resumeId],
    references: [resumes.id],
  }),
}));

// Export schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPersonalInfoSchema = createInsertSchema(personalInfo).omit({
  id: true,
});

export const insertWorkExperienceSchema = createInsertSchema(workExperience).omit({
  id: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertSkillsSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertJobDescriptionSchema = createInsertSchema(jobDescriptions).omit({
  id: true,
  createdAt: true,
});

export const insertResumeVersionSchema = createInsertSchema(resumeVersions).omit({
  id: true,
  createdAt: true,
});

export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions).omit({
  id: true,
  createdAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type WorkExperience = typeof workExperience.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Skills = typeof skills.$inferSelect;
export type JobDescription = typeof jobDescriptions.$inferSelect;
export type ResumeVersion = typeof resumeVersions.$inferSelect;
export type AiSuggestion = typeof aiSuggestions.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertSkills = z.infer<typeof insertSkillsSchema>;
export type InsertJobDescription = z.infer<typeof insertJobDescriptionSchema>;
export type InsertResumeVersion = z.infer<typeof insertResumeVersionSchema>;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;

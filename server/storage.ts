import {
  users,
  resumes,
  personalInfo,
  workExperience,
  education,
  skills,
  jobDescriptions,
  resumeVersions,
  aiSuggestions,
  type User,
  type UpsertUser,
  type Resume,
  type PersonalInfo,
  type WorkExperience,
  type Education,
  type Skills,
  type JobDescription,
  type ResumeVersion,
  type AiSuggestion,
  type InsertResume,
  type InsertPersonalInfo,
  type InsertWorkExperience,
  type InsertEducation,
  type InsertSkills,
  type InsertJobDescription,
  type InsertResumeVersion,
  type InsertAiSuggestion,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumeWithDetails(id: string): Promise<any | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;
  
  // Personal info operations
  upsertPersonalInfo(data: InsertPersonalInfo): Promise<PersonalInfo>;
  getPersonalInfo(resumeId: string): Promise<PersonalInfo | undefined>;
  
  // Work experience operations
  createWorkExperience(data: InsertWorkExperience): Promise<WorkExperience>;
  getWorkExperience(id: string): Promise<WorkExperience | undefined>;
  updateWorkExperience(id: string, data: Partial<InsertWorkExperience>): Promise<WorkExperience>;
  deleteWorkExperience(id: string): Promise<void>;
  getResumeWorkExperience(resumeId: string): Promise<WorkExperience[]>;
  
  // Education operations
  createEducation(data: InsertEducation): Promise<Education>;
  getEducation(id: string): Promise<Education | undefined>;
  updateEducation(id: string, data: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: string): Promise<void>;
  getResumeEducation(resumeId: string): Promise<Education[]>;
  
  // Skills operations
  createSkill(data: InsertSkills): Promise<Skills>;
  getSkill(id: string): Promise<Skills | undefined>;
  updateSkill(id: string, data: Partial<InsertSkills>): Promise<Skills>;
  deleteSkill(id: string): Promise<void>;
  getResumeSkills(resumeId: string): Promise<Skills[]>;
  
  // Job description operations
  createJobDescription(data: InsertJobDescription): Promise<JobDescription>;
  getUserJobDescriptions(userId: string): Promise<JobDescription[]>;
  
  // Stats operations
  getUserStats(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Resume operations
  async createResume(resumeData: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(resumeData).returning();
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getResumeWithDetails(id: string): Promise<any | undefined> {
    const resume = await this.getResume(id);
    if (!resume) return undefined;

    const [personalInfoData, workExp, edu, skillsData] = await Promise.all([
      this.getPersonalInfo(id),
      this.getResumeWorkExperience(id),
      this.getResumeEducation(id),
      this.getResumeSkills(id),
    ]);

    return {
      ...resume,
      personalInfo: personalInfoData,
      workExperience: workExp,
      education: edu,
      skills: skillsData,
    };
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Personal info operations
  async upsertPersonalInfo(data: InsertPersonalInfo): Promise<PersonalInfo> {
    const [info] = await db
      .insert(personalInfo)
      .values(data)
      .onConflictDoUpdate({
        target: personalInfo.resumeId,
        set: data,
      })
      .returning();
    return info;
  }

  async getPersonalInfo(resumeId: string): Promise<PersonalInfo | undefined> {
    const [info] = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.resumeId, resumeId));
    return info;
  }

  // Work experience operations
  async createWorkExperience(data: InsertWorkExperience): Promise<WorkExperience> {
    const [exp] = await db.insert(workExperience).values(data).returning();
    return exp;
  }

  async getWorkExperience(id: string): Promise<WorkExperience | undefined> {
    const [exp] = await db.select().from(workExperience).where(eq(workExperience.id, id));
    return exp;
  }

  async updateWorkExperience(id: string, data: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const [exp] = await db
      .update(workExperience)
      .set(data)
      .where(eq(workExperience.id, id))
      .returning();
    return exp;
  }

  async deleteWorkExperience(id: string): Promise<void> {
    await db.delete(workExperience).where(eq(workExperience.id, id));
  }

  async getResumeWorkExperience(resumeId: string): Promise<WorkExperience[]> {
    return await db
      .select()
      .from(workExperience)
      .where(eq(workExperience.resumeId, resumeId))
      .orderBy(workExperience.order, desc(workExperience.startYear), desc(workExperience.startMonth));
  }

  // Education operations
  async createEducation(data: InsertEducation): Promise<Education> {
    const [edu] = await db.insert(education).values(data).returning();
    return edu;
  }

  async getEducation(id: string): Promise<Education | undefined> {
    const [edu] = await db.select().from(education).where(eq(education.id, id));
    return edu;
  }

  async updateEducation(id: string, data: Partial<InsertEducation>): Promise<Education> {
    const [edu] = await db
      .update(education)
      .set(data)
      .where(eq(education.id, id))
      .returning();
    return edu;
  }

  async deleteEducation(id: string): Promise<void> {
    await db.delete(education).where(eq(education.id, id));
  }

  async getResumeEducation(resumeId: string): Promise<Education[]> {
    return await db
      .select()
      .from(education)
      .where(eq(education.resumeId, resumeId))
      .orderBy(education.order, desc(education.startYear), desc(education.startMonth));
  }

  // Skills operations
  async createSkill(data: InsertSkills): Promise<Skills> {
    const [skill] = await db.insert(skills).values(data).returning();
    return skill;
  }

  async getSkill(id: string): Promise<Skills | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async updateSkill(id: string, data: Partial<InsertSkills>): Promise<Skills> {
    const [skill] = await db
      .update(skills)
      .set(data)
      .where(eq(skills.id, id))
      .returning();
    return skill;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getResumeSkills(resumeId: string): Promise<Skills[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.resumeId, resumeId))
      .orderBy(skills.order, skills.name);
  }

  // Job description operations
  async createJobDescription(data: InsertJobDescription): Promise<JobDescription> {
    const [job] = await db.insert(jobDescriptions).values(data).returning();
    return job;
  }

  async getUserJobDescriptions(userId: string): Promise<JobDescription[]> {
    return await db
      .select()
      .from(jobDescriptions)
      .where(eq(jobDescriptions.userId, userId))
      .orderBy(desc(jobDescriptions.createdAt));
  }

  // Stats operations
  async getUserStats(userId: string): Promise<any> {
    const userResumes = await this.getUserResumes(userId);
    
    return {
      totalResumes: userResumes.length,
      totalDownloads: userResumes.length * 5, // Mock calculation
      averageMatchScore: 85, // Mock value
      profileViews: userResumes.length * 15, // Mock calculation
    };
  }
}

export const storage = new DatabaseStorage();

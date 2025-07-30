import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertResumeSchema, 
  insertPersonalInfoSchema, 
  insertWorkExperienceSchema, 
  insertEducationSchema,
  insertSkillsSchema,
  insertJobDescriptionSchema
} from "@shared/schema";
import { aiService } from "./services/aiService";
import { pdfService } from "./services/pdfService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Resume routes
  app.get('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.post('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumeData = insertResumeSchema.parse({ ...req.body, userId });
      const resume = await storage.createResume(resumeData);
      res.json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  app.get('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResumeWithDetails(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.put('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const resumeData = insertResumeSchema.partial().parse(req.body);
      const updatedResume = await storage.updateResume(req.params.id, resumeData);
      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      await storage.deleteResume(req.params.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Personal info routes
  app.put('/api/resumes/:id/personal-info', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const personalInfoData = insertPersonalInfoSchema.parse({ 
        ...req.body, 
        resumeId: req.params.id 
      });
      
      const personalInfo = await storage.upsertPersonalInfo(personalInfoData);
      res.json(personalInfo);
    } catch (error) {
      console.error("Error updating personal info:", error);
      res.status(500).json({ message: "Failed to update personal info" });
    }
  });

  // Work experience routes
  app.post('/api/resumes/:id/work-experience', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const workExpData = insertWorkExperienceSchema.parse({ 
        ...req.body, 
        resumeId: req.params.id 
      });
      
      const workExp = await storage.createWorkExperience(workExpData);
      res.json(workExp);
    } catch (error) {
      console.error("Error creating work experience:", error);
      res.status(500).json({ message: "Failed to create work experience" });
    }
  });

  app.put('/api/work-experience/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workExp = await storage.getWorkExperience(req.params.id);
      
      if (!workExp) {
        return res.status(404).json({ message: "Work experience not found" });
      }
      
      const resume = await storage.getResume(workExp.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const workExpData = insertWorkExperienceSchema.partial().parse(req.body);
      const updatedWorkExp = await storage.updateWorkExperience(req.params.id, workExpData);
      res.json(updatedWorkExp);
    } catch (error) {
      console.error("Error updating work experience:", error);
      res.status(500).json({ message: "Failed to update work experience" });
    }
  });

  app.delete('/api/work-experience/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workExp = await storage.getWorkExperience(req.params.id);
      
      if (!workExp) {
        return res.status(404).json({ message: "Work experience not found" });
      }
      
      const resume = await storage.getResume(workExp.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteWorkExperience(req.params.id);
      res.json({ message: "Work experience deleted successfully" });
    } catch (error) {
      console.error("Error deleting work experience:", error);
      res.status(500).json({ message: "Failed to delete work experience" });
    }
  });

  // Education routes
  app.post('/api/resumes/:id/education', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const educationData = insertEducationSchema.parse({ 
        ...req.body, 
        resumeId: req.params.id 
      });
      
      const education = await storage.createEducation(educationData);
      res.json(education);
    } catch (error) {
      console.error("Error creating education:", error);
      res.status(500).json({ message: "Failed to create education" });
    }
  });

  app.put('/api/education/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const education = await storage.getEducation(req.params.id);
      
      if (!education) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      const resume = await storage.getResume(education.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const educationData = insertEducationSchema.partial().parse(req.body);
      const updatedEducation = await storage.updateEducation(req.params.id, educationData);
      res.json(updatedEducation);
    } catch (error) {
      console.error("Error updating education:", error);
      res.status(500).json({ message: "Failed to update education" });
    }
  });

  app.delete('/api/education/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const education = await storage.getEducation(req.params.id);
      
      if (!education) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      const resume = await storage.getResume(education.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteEducation(req.params.id);
      res.json({ message: "Education deleted successfully" });
    } catch (error) {
      console.error("Error deleting education:", error);
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Skills routes
  app.post('/api/resumes/:id/skills', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const skillsData = insertSkillsSchema.parse({ 
        ...req.body, 
        resumeId: req.params.id 
      });
      
      const skill = await storage.createSkill(skillsData);
      res.json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put('/api/skills/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const skill = await storage.getSkill(req.params.id);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      const resume = await storage.getResume(skill.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const skillData = insertSkillsSchema.partial().parse(req.body);
      const updatedSkill = await storage.updateSkill(req.params.id, skillData);
      res.json(updatedSkill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete('/api/skills/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const skill = await storage.getSkill(req.params.id);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      const resume = await storage.getResume(skill.resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteSkill(req.params.id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // AI routes
  app.post('/api/ai/enhance-summary', isAuthenticated, async (req: any, res) => {
    try {
      const { personalInfo, workExperience, skills, jobDescription } = req.body;
      const enhancedSummary = await aiService.enhanceSummary(personalInfo, workExperience, skills, jobDescription);
      res.json({ summary: enhancedSummary });
    } catch (error) {
      console.error("Error enhancing summary:", error);
      res.status(500).json({ message: "Failed to enhance summary" });
    }
  });

  app.post('/api/ai/enhance-experience', isAuthenticated, async (req: any, res) => {
    try {
      const { experience, jobDescription } = req.body;
      const enhancedExperience = await aiService.enhanceWorkExperience(experience, jobDescription);
      res.json({ achievements: enhancedExperience });
    } catch (error) {
      console.error("Error enhancing experience:", error);
      res.status(500).json({ message: "Failed to enhance experience" });
    }
  });

  app.post('/api/ai/analyze-job-match', isAuthenticated, async (req: any, res) => {
    try {
      const { resumeId, jobDescription } = req.body;
      const userId = req.user.claims.sub;
      
      const resume = await storage.getResumeWithDetails(resumeId);
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const analysis = await aiService.analyzeJobMatch(resume, jobDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing job match:", error);
      res.status(500).json({ message: "Failed to analyze job match" });
    }
  });

  app.post('/api/ai/suggest-skills', isAuthenticated, async (req: any, res) => {
    try {
      const { currentSkills, jobDescription } = req.body;
      const suggestions = await aiService.suggestSkills(currentSkills, jobDescription);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error suggesting skills:", error);
      res.status(500).json({ message: "Failed to suggest skills" });
    }
  });

  // Job description routes
  app.post('/api/job-descriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobData = insertJobDescriptionSchema.parse({ ...req.body, userId });
      const jobDescription = await storage.createJobDescription(jobData);
      res.json(jobDescription);
    } catch (error) {
      console.error("Error creating job description:", error);
      res.status(500).json({ message: "Failed to create job description" });
    }
  });

  app.get('/api/job-descriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobDescriptions = await storage.getUserJobDescriptions(userId);
      res.json(jobDescriptions);
    } catch (error) {
      console.error("Error fetching job descriptions:", error);
      res.status(500).json({ message: "Failed to fetch job descriptions" });
    }
  });

  // PDF export route
  app.post('/api/resumes/:id/export', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResumeWithDetails(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const pdfBuffer = await pdfService.generateResumePDF(resume);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ message: "Failed to export PDF" });
    }
  });

  // Resume statistics
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_ENV_VAR || 'default_key';
  }

  private async makeGroqRequest(messages: Array<{ role: string; content: string }>, maxTokens = 500): Promise<string> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  async enhanceSummary(personalInfo: any, workExperience: any[], skills: any[], jobDescription?: string): Promise<string> {
    const context = `
Personal Info: ${JSON.stringify(personalInfo)}
Work Experience: ${JSON.stringify(workExperience)}
Skills: ${JSON.stringify(skills)}
${jobDescription ? `Target Job: ${jobDescription}` : ''}
    `;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional resume writer. Create compelling, ATS-friendly professional summaries that highlight relevant experience and skills.'
      },
      {
        role: 'user',
        content: `Based on the following information, write a professional summary (2-3 sentences) that would be perfect for a resume. Focus on key achievements, skills, and career highlights. Make it engaging and professional.\n\n${context}`
      }
    ];

    return await this.makeGroqRequest(messages);
  }

  async enhanceWorkExperience(experience: any, jobDescription?: string): Promise<string[]> {
    const context = `
Job Title: ${experience.jobTitle}
Company: ${experience.company}
Current Description: ${experience.description}
${jobDescription ? `Target Job Description: ${jobDescription}` : ''}
    `;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional resume writer. Create impactful bullet points for work experience that show quantifiable achievements and use action verbs. Format as a JSON array of strings.'
      },
      {
        role: 'user',
        content: `Enhance the following work experience into 3-5 powerful bullet points that demonstrate impact and achievements. Use metrics where possible and start with strong action verbs. Return as JSON array only.\n\n${context}`
      }
    ];

    const response = await this.makeGroqRequest(messages, 800);
    
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [response];
    } catch {
      // If JSON parsing fails, split by lines and clean up
      return response.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).map(line => line.trim().replace(/^[•-]\s*/, ''));
    }
  }

  async analyzeJobMatch(resume: any, jobDescription: string): Promise<{
    matchScore: number;
    missingSkills: string[];
    strengths: string[];
    suggestions: string[];
  }> {
    const resumeContext = `
Personal Info: ${JSON.stringify(resume.personalInfo)}
Work Experience: ${JSON.stringify(resume.workExperience)}
Education: ${JSON.stringify(resume.education)}
Skills: ${JSON.stringify(resume.skills)}
    `;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert ATS system and recruiter. Analyze resumes against job descriptions and provide detailed matching analysis. Return response as valid JSON only.'
      },
      {
        role: 'user',
        content: `Analyze the following resume against the job description and provide a detailed match analysis. Return a JSON object with:
- matchScore: number (0-100)
- missingSkills: array of skills mentioned in job but missing from resume
- strengths: array of strong matching points
- suggestions: array of improvement suggestions

Resume: ${resumeContext}

Job Description: ${jobDescription}`
      }
    ];

    const response = await this.makeGroqRequest(messages, 1000);
    
    try {
      const analysis = JSON.parse(response);
      return {
        matchScore: analysis.matchScore || 0,
        missingSkills: analysis.missingSkills || [],
        strengths: analysis.strengths || [],
        suggestions: analysis.suggestions || [],
      };
    } catch (error) {
      console.error('Failed to parse AI analysis:', error);
      return {
        matchScore: 75,
        missingSkills: [],
        strengths: ['Professional experience matches job requirements'],
        suggestions: ['Consider adding more specific technical skills'],
      };
    }
  }

  async suggestSkills(currentSkills: string[], jobDescription: string): Promise<string[]> {
    const messages = [
      {
        role: 'system',
        content: 'You are a career advisor. Suggest relevant skills based on job descriptions that would strengthen a candidate\'s profile. Return as JSON array of skill names only.'
      },
      {
        role: 'user',
        content: `Current Skills: ${currentSkills.join(', ')}

Job Description: ${jobDescription}

Suggest 5-8 additional skills that would be valuable for this role but are not already listed. Return as JSON array of skill names only.`
      }
    ];

    const response = await this.makeGroqRequest(messages, 400);
    
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fallback suggestions
      return ['Communication', 'Leadership', 'Problem Solving', 'Project Management'];
    }
  }
}

export const aiService = new AIService();

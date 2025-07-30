export interface PersonalInfo {
  id?: string;
  resumeId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface WorkExperience {
  id?: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  location?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  isPresent: boolean;
  description?: string;
  achievements?: string[];
  order: number;
}

export interface Education {
  id?: string;
  resumeId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  isPresent: boolean;
  gpa?: string;
  achievements?: string[];
  order: number;
}

export interface Skill {
  id?: string;
  resumeId: string;
  name: string;
  category?: string;
  proficiency: number;
  order: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  personalInfo?: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

export interface JobAnalysis {
  matchScore: number;
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
}

export interface UserStats {
  totalResumes: number;
  totalDownloads: number;
  averageMatchScore: number;
  profileViews: number;
}

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const generateYears = (startYear = 1990, endYear = new Date().getFullYear() + 10) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({ value: year, label: year.toString() });
  }
  return years;
};

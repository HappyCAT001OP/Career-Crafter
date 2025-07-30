import { Eye, Download, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  resumeId: string;
  className?: string;
}

export default function ResumePreview({ resumeId, className = "" }: ResumePreviewProps) {
  const { toast } = useToast();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const generatePdfMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/resumes/${resumeId}/pdf`, {
        method: "POST",
        responseType: "blob",
      });
      return response;
    },
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume?.title || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    },
  });

  const formatDate = (month: number, year: number) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  if (isLoading) {
    return (
      <div className={`card-glass p-8 ${className}`}>
        <div className="space-y-6">
          <div className="loading-skeleton h-8 w-3/4" />
          <div className="loading-skeleton h-4 w-1/2" />
          <div className="space-y-2">
            <div className="loading-skeleton h-3 w-full" />
            <div className="loading-skeleton h-3 w-5/6" />
            <div className="loading-skeleton h-3 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className={`card-glass p-8 text-center ${className}`}>
        <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
        <p className="text-gray-400">No resume data to preview</p>
      </div>
    );
  }

  return (
    <div className={`card-glass ${className}`}>
      {/* Header */}
      <div className="border-b border-gold-primary/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gold-primary" />
            <h3 className="text-lg font-semibold text-gold-primary">Resume Preview</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => generatePdfMutation.mutate()}
              disabled={generatePdfMutation.isPending}
              className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span>{generatePdfMutation.isPending ? "Generating..." : "PDF"}</span>
            </button>
            <button className="btn-ghost text-xs py-2 px-3 flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <span>Full View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6 space-y-6 bg-white text-black max-h-[600px] overflow-y-auto">
        {/* Personal Info */}
        {resume.personalInfo && (
          <div className="text-center border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {resume.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {resume.personalInfo.email && (
                <span>{resume.personalInfo.email}</span>
              )}
              {resume.personalInfo.phone && (
                <span>{resume.personalInfo.phone}</span>
              )}
              {resume.personalInfo.location && (
                <span>{resume.personalInfo.location}</span>
              )}
            </div>
            {resume.personalInfo.website && (
              <div className="mt-2">
                <span className="text-sm text-blue-600">{resume.personalInfo.website}</span>
              </div>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {resume.personalInfo?.summary && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resume.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {resume.workExperience && resume.workExperience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {resume.workExperience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-sm text-gray-700">{exp.company}</p>
                      {exp.location && (
                        <p className="text-xs text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      {formatDate(exp.startMonth, exp.startYear)} - {" "}
                      {exp.isPresent ? "Present" : formatDate(exp.endMonth, exp.endYear)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-1">
                      {exp.achievements.map((achievement: string, achIndex: number) => (
                        <li key={achIndex} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {resume.education.map((edu: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      {formatDate(edu.startMonth, edu.startYear)} - {" "}
                      {edu.isPresent ? "Present" : formatDate(edu.endMonth, edu.endYear)}
                    </div>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      {edu.achievements.map((achievement: string, achIndex: number) => (
                        <li key={achIndex} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(
                resume.skills.reduce((acc: any, skill: any) => {
                  const category = skill.category || "Other";
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {})
              ).map(([category, categorySkills]: [string, any]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill: any, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!resume.personalInfo && !resume.workExperience?.length && !resume.education?.length && !resume.skills?.length && (
          <div className="text-center py-12 text-gray-500">
            <p>Start filling out your resume sections to see the preview here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
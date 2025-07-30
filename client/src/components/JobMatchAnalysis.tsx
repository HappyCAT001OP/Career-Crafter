import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Target, FileText, Sparkles, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobMatchAnalysisProps {
  resumeId: string;
}

interface MatchResult {
  overallScore: number;
  missingSkills: string[];
  recommendations: string[];
  strengths: string[];
  analysis: string;
}

export default function JobMatchAnalysis({ resumeId }: JobMatchAnalysisProps) {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const { data: resume, isLoading: resumeLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const analyzeJobMatchMutation = useMutation({
    mutationFn: async () => {
      if (!jobDescription.trim()) {
        throw new Error("Please enter a job description");
      }

      const userSkills = resume?.skills?.map((s: any) => s.name) || [];
      
      return apiRequest("/api/ai/analyze-job-match", {
        method: "POST",
        body: JSON.stringify({
          resumeData: {
            personalInfo: resume?.personalInfo,
            workExperience: resume?.workExperience,
            education: resume?.education,
            skills: userSkills,
          },
          jobDescription,
        }),
      });
    },
    onSuccess: (data) => {
      setMatchResult(data);
      toast({
        title: "Analysis Complete",
        description: "Job match analysis has been generated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze job match at this time",
        variant: "destructive",
      });
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-400" />;
    if (score >= 60) return <AlertCircle className="h-6 w-6 text-yellow-400" />;
    return <XCircle className="h-6 w-6 text-red-400" />;
  };

  if (resumeLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-32 w-full" />
        <div className="loading-skeleton h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Target className="h-6 w-6 text-gold-primary" />
        <h3 className="text-lg font-semibold text-gold-primary">Job Match Analysis</h3>
      </div>

      {/* Job Description Input */}
      <div className="card-glass p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-gold-primary" />
          <h4 className="text-md font-medium text-gold-primary">Job Description</h4>
        </div>
        
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          className="form-textarea mb-4"
          placeholder="Paste the job description here to analyze how well your resume matches the requirements..."
        />
        
        <button
          onClick={() => analyzeJobMatchMutation.mutate()}
          disabled={analyzeJobMatchMutation.isPending || !jobDescription.trim()}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {analyzeJobMatchMutation.isPending ? "Analyzing..." : "Analyze Job Match"}
          </span>
        </button>
      </div>

      {/* Analysis Results */}
      {matchResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gold-primary">Match Score</h4>
              {getScoreIcon(matchResult.overallScore)}
            </div>
            
            <div className="flex items-end space-x-4">
              <div className={`text-4xl font-bold ${getScoreColor(matchResult.overallScore)}`}>
                {matchResult.overallScore}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      matchResult.overallScore >= 80
                        ? "bg-green-400"
                        : matchResult.overallScore >= 60
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${matchResult.overallScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {matchResult.overallScore >= 80
                    ? "Excellent match"
                    : matchResult.overallScore >= 60
                    ? "Good match"
                    : "Needs improvement"}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="card-glass p-6">
              <h4 className="text-md font-medium text-green-400 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Your Strengths
              </h4>
              <div className="space-y-2">
                {matchResult.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card-glass p-6">
              <h4 className="text-md font-medium text-red-400 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Missing Skills
              </h4>
              <div className="space-y-2">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="skill-tag bg-red-500/20 text-red-400">
                        {skill}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    Great! You have all the required skills.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-glass p-6">
            <h4 className="text-md font-medium text-gold-primary mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Recommendations
            </h4>
            <div className="space-y-3">
              {matchResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gold-primary/10 rounded-lg">
                  <span className="text-gold-primary font-bold text-sm">{index + 1}.</span>
                  <p className="text-gray-300 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="card-glass p-6">
            <h4 className="text-md font-medium text-gold-primary mb-4">
              Detailed Analysis
            </h4>
            <p className="text-gray-300 leading-relaxed">{matchResult.analysis}</p>
          </div>
        </div>
      )}

      {/* No Analysis Yet */}
      {!matchResult && !analyzeJobMatchMutation.isPending && (
        <div className="text-center py-12 text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="mb-2">No job analysis yet</p>
          <p className="text-sm">
            Enter a job description above to see how well your resume matches the requirements.
          </p>
        </div>
      )}
    </div>
  );
}
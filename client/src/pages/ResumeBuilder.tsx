import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import WorkExperienceForm from "@/components/WorkExperienceForm";
import EducationForm from "@/components/EducationForm";
import SkillsForm from "@/components/SkillsForm";
import ResumePreview from "@/components/ResumePreview";
import JobMatchAnalysis from "@/components/JobMatchAnalysis";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, Share, RotateCcw, Expand } from "lucide-react";
import type { Resume } from "@/types/resume";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ResumeBuilder() {
  const [, params] = useRoute("/builder/:id?");
  const resumeId = params?.id;
  const [isNewResume] = useState(!resumeId);
  
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch resume data if editing existing resume
  const { data: resume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId && isAuthenticated,
    retry: false,
  });

  // Create new resume mutation
  const createResumeMutation = useMutation({
    mutationFn: async (data: { title: string }) => {
      const response = await apiRequest("POST", "/api/resumes", data);
      return response.json();
    },
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume created successfully!",
      });
      // Redirect to the new resume
      window.history.replaceState(null, "", `/builder/${newResume.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Export PDF mutation
  const exportPdfMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      const response = await apiRequest("POST", `/api/resumes/${resumeId}/export`);
      return response.blob();
    },
    onSuccess: (blob, resumeId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume?.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Resume exported successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle new resume creation
  useEffect(() => {
    if (isNewResume && isAuthenticated && !createResumeMutation.isPending) {
      createResumeMutation.mutate({ title: "My Resume" });
    }
  }, [isNewResume, isAuthenticated]);

  const handleExportPDF = () => {
    if (resumeId) {
      exportPdfMutation.mutate(resumeId);
    }
  };

  const handleSaveVersion = () => {
    toast({
      title: "Coming Soon",
      description: "Version saving feature will be available soon!",
    });
  };

  const handleShareResume = () => {
    toast({
      title: "Coming Soon",
      description: "Resume sharing feature will be available soon!",
    });
  };

  if (isLoading || resumeLoading || createResumeMutation.isPending) {
    return (
      <div className="min-h-screen bg-deep-black">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 gold-gradient rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gold-primary">
              {createResumeMutation.isPending ? "Creating your resume..." : "Loading resume builder..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentResumeId = resumeId || createResumeMutation.data?.id;

  if (!currentResumeId) {
    return (
      <div className="min-h-screen bg-deep-black">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-red-400">Failed to load resume. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      
      <main className="pt-20">
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Intelligent Resume
                <span className="text-gold-primary"> Builder</span>
              </h1>
              <p className="text-xl text-gray-400">Build your resume with AI assistance and real-time optimization</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Panel - Form Inputs */}
              <div className="lg:col-span-1">
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-card-dark border border-gold-primary/20">
                    <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                    <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <PersonalInfoForm resumeId={currentResumeId} />
                  </TabsContent>

                  <TabsContent value="experience">
                    <WorkExperienceForm resumeId={currentResumeId} />
                  </TabsContent>

                  <TabsContent value="education">
                    <EducationForm resumeId={currentResumeId} />
                  </TabsContent>

                  <TabsContent value="skills">
                    <SkillsForm resumeId={currentResumeId} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Center Panel - Resume Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="card-glass p-6 h-[600px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gold-primary">Live Preview</h3>
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 bg-gold-primary/20 text-gold-primary rounded-lg hover:bg-gold-primary/30 transition-colors">
                          <RotateCcw className="w-4 h-4 mx-auto" />
                        </button>
                        <button className="w-8 h-8 bg-gold-primary/20 text-gold-primary rounded-lg hover:bg-gold-primary/30 transition-colors">
                          <Expand className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                    <ResumePreview resumeId={currentResumeId} />
                  </div>
                </div>
              </div>

              {/* Right Panel - AI Tools */}
              <div className="lg:col-span-1">
                <JobMatchAnalysis resumeId={currentResumeId} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-12">
              <Button 
                onClick={handleExportPDF}
                disabled={exportPdfMutation.isPending}
                className="btn-primary"
              >
                <Download className="w-5 h-5 mr-2" />
                {exportPdfMutation.isPending ? "Exporting..." : "Export PDF"}
              </Button>
              <Button onClick={handleSaveVersion} className="btn-secondary">
                <Save className="w-5 h-5 mr-2" />
                Save Version
              </Button>
              <Button onClick={handleShareResume} className="btn-secondary">
                <Share className="w-5 h-5 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </section>
      </main>

      <FloatingActionButton />
    </div>
  );
}

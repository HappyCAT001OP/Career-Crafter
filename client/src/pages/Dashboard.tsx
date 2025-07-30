import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Calendar, Edit3, Trash2, Eye, Download, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resumes, isLoading } = useQuery({
    queryKey: ["/api/resumes"],
  });

  const createResumeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/resumes", {
        method: "POST",
        body: JSON.stringify({
          title: `Resume ${(resumes?.length || 0) + 1}`,
        }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "New resume created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create resume",
        variant: "destructive",
      });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return apiRequest(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Resumes</h1>
              <p className="text-gray-400">
                Create and manage your professional resumes with AI-powered insights
              </p>
            </div>
            
            <button
              onClick={() => createResumeMutation.mutate()}
              disabled={createResumeMutation.isPending}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>{createResumeMutation.isPending ? "Creating..." : "New Resume"}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-glass p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gold-primary/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gold-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Resumes</p>
                  <p className="text-2xl font-bold text-white">{resumes?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI Enhanced</p>
                  <p className="text-2xl font-bold text-white">
                    {resumes?.filter((r: any) => r.aiEnhanced)?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-white">
                    {resumes?.length ? formatDate(resumes[0].updatedAt) : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Grid */}
        {!resumes || resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gold-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Get started by creating your first resume. Our AI will help you craft the perfect 
              professional profile.
            </p>
            <button
              onClick={() => createResumeMutation.mutate()}
              disabled={createResumeMutation.isPending}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Resume</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume: any) => (
              <div key={resume.id} className="card-3d-interactive group">
                <div className="p-6">
                  {/* Resume Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gold-primary transition-colors">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {resume.isActive && (
                        <span className="badge-free">Active</span>
                      )}
                      <button
                        onClick={() => deleteResumeMutation.mutate(resume.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Resume Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-deep-black/50 rounded-lg">
                      <p className="text-xl font-bold text-gold-primary">
                        {(resume.workExperience?.length || 0) + (resume.education?.length || 0)}
                      </p>
                      <p className="text-xs text-gray-400">Sections</p>
                    </div>
                    <div className="text-center p-3 bg-deep-black/50 rounded-lg">
                      <p className="text-xl font-bold text-gold-primary">
                        {resume.skills?.length || 0}
                      </p>
                      <p className="text-xs text-gray-400">Skills</p>
                    </div>
                  </div>

                  {/* Resume Preview */}
                  <div className="bg-deep-black/30 rounded-lg p-4 mb-6 border border-gold-primary/10">
                    <div className="space-y-2">
                      <div className="h-3 bg-gold-primary/30 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/resume-builder?id=${resume.id}`}>
                      <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </Link>
                    
                    <div className="flex space-x-2">
                      <button className="btn-ghost flex-1 flex items-center justify-center">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="btn-ghost flex-1 flex items-center justify-center">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 card-glass p-8 text-center">
          <h3 className="text-xl font-semibold text-gold-primary mb-4">
            Ready to craft your perfect resume?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Use our AI-powered tools to enhance your resume content, analyze job matches, 
            and increase your chances of landing your dream job.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => createResumeMutation.mutate()}
              disabled={createResumeMutation.isPending}
              className="btn-primary"
            >
              Create New Resume
            </button>
            <Link href="/resume-builder">
              <button className="btn-secondary">
                Resume Builder
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
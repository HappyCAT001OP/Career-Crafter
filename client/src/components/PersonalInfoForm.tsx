import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, MapPin, Globe, FileText, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedIn: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  resumeId: string;
  onSave?: (data: PersonalInfoFormData) => void;
}

export default function PersonalInfoForm({ resumeId, onSave }: PersonalInfoFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedIn: "",
      github: "",
      summary: "",
    },
  });

  useEffect(() => {
    if (resume?.personalInfo) {
      form.reset({
        fullName: resume.personalInfo.fullName || "",
        email: resume.personalInfo.email || "",
        phone: resume.personalInfo.phone || "",
        location: resume.personalInfo.location || "",
        website: resume.personalInfo.website || "",
        linkedIn: resume.personalInfo.linkedIn || "",
        github: resume.personalInfo.github || "",
        summary: resume.personalInfo.summary || "",
      });
    }
  }, [resume, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: PersonalInfoFormData) => {
      return apiRequest(`/api/resumes/${resumeId}/personal-info`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      onSave?.(form.getValues());
      toast({
        title: "Success",
        description: "Personal information saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save personal information",
        variant: "destructive",
      });
    },
  });

  const enhanceSummaryMutation = useMutation({
    mutationFn: async () => {
      const currentSummary = form.getValues("summary");
      const fullName = form.getValues("fullName");
      
      return apiRequest("/api/ai/enhance-summary", {
        method: "POST",
        body: JSON.stringify({
          currentSummary,
          fullName,
          resumeData: {
            personalInfo: form.getValues(),
            workExperience: resume?.workExperience || [],
            education: resume?.education || [],
            skills: resume?.skills || [],
          },
        }),
      });
    },
    onSuccess: (data) => {
      form.setValue("summary", data.enhancedSummary);
      toast({
        title: "AI Enhancement Complete",
        description: "Professional summary has been enhanced",
      });
    },
    onError: () => {
      toast({
        title: "AI Enhancement Failed",
        description: "Could not enhance summary at this time",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="loading-skeleton h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-gold-primary" />
        <h3 className="text-lg font-semibold text-gold-primary">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gold-primary mb-2">
            <User className="inline h-4 w-4 mr-2" />
            Full Name *
          </label>
          <input
            {...form.register("fullName")}
            className="form-input"
            placeholder="John Doe"
          />
          {form.formState.errors.fullName && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            <Mail className="inline h-4 w-4 mr-2" />
            Email Address *
          </label>
          <input
            {...form.register("email")}
            type="email"
            className="form-input"
            placeholder="john@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            <Phone className="inline h-4 w-4 mr-2" />
            Phone Number
          </label>
          <input
            {...form.register("phone")}
            type="tel"
            className="form-input"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            <MapPin className="inline h-4 w-4 mr-2" />
            Location
          </label>
          <input
            {...form.register("location")}
            className="form-input"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            <Globe className="inline h-4 w-4 mr-2" />
            Website
          </label>
          <input
            {...form.register("website")}
            type="url"
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
          {form.formState.errors.website && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.website.message}
            </p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            LinkedIn Profile
          </label>
          <input
            {...form.register("linkedIn")}
            type="url"
            className="form-input"
            placeholder="https://linkedin.com/in/username"
          />
          {form.formState.errors.linkedIn && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.linkedIn.message}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-gold-primary mb-2">
            GitHub Profile
          </label>
          <input
            {...form.register("github")}
            type="url"
            className="form-input"
            placeholder="https://github.com/username"
          />
          {form.formState.errors.github && (
            <p className="text-red-400 text-xs mt-1">
              {form.formState.errors.github.message}
            </p>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gold-primary">
            <FileText className="inline h-4 w-4 mr-2" />
            Professional Summary
          </label>
          <button
            type="button"
            onClick={() => enhanceSummaryMutation.mutate()}
            disabled={enhanceSummaryMutation.isPending}
            className="text-xs btn-secondary py-1 px-3"
          >
            {enhanceSummaryMutation.isPending ? "Enhancing..." : "✨ AI Enhance"}
          </button>
        </div>
        <textarea
          {...form.register("summary")}
          rows={4}
          className="form-textarea"
          placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
        />
        <p className="text-xs text-gray-400 mt-1">
          A strong summary should be 2-3 sentences that capture your professional identity and value proposition.
        </p>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="btn-primary flex-1"
        >
          {saveMutation.isPending ? "Saving..." : "Save Personal Information"}
        </button>
      </div>
    </form>
  );
}
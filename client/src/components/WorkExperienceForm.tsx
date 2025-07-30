import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Calendar, MapPin, Plus, Trash2, Sparkles, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const workExperienceSchema = z.object({
  experiences: z.array(z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    startMonth: z.number().min(1).max(12),
    startYear: z.number().min(1950),
    endMonth: z.number().min(1).max(12).optional(),
    endYear: z.number().min(1950).optional(),
    isPresent: z.boolean().default(false),
    description: z.string().optional(),
    achievements: z.array(z.string().min(1)).default([]),
  })).default([]),
});

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

interface WorkExperienceFormProps {
  resumeId: string;
  onSave?: (data: WorkExperienceFormData) => void;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const years = Array.from({ length: 60 }, (_, i) => ({
  value: new Date().getFullYear() - i,
  label: (new Date().getFullYear() - i).toString(),
}));

export default function WorkExperienceForm({ resumeId, onSave }: WorkExperienceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAiEnhancing, setIsAiEnhancing] = useState<number | null>(null);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  useEffect(() => {
    if (resume?.workExperience) {
      form.reset({
        experiences: resume.workExperience.map((exp: any) => ({
          jobTitle: exp.jobTitle || "",
          company: exp.company || "",
          location: exp.location || "",
          startMonth: exp.startMonth || 1,
          startYear: exp.startYear || new Date().getFullYear(),
          endMonth: exp.endMonth || undefined,
          endYear: exp.endYear || undefined,
          isPresent: exp.isPresent || false,
          description: exp.description || "",
          achievements: exp.achievements || [],
        })),
      });
    }
  }, [resume, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: WorkExperienceFormData) => {
      return apiRequest(`/api/resumes/${resumeId}/work-experience`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      onSave?.(form.getValues());
      toast({
        title: "Success",
        description: "Work experience saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save work experience",
        variant: "destructive",
      });
    },
  });

  const enhanceDescriptionMutation = useMutation({
    mutationFn: async ({ index, jobTitle, company }: { index: number; jobTitle: string; company: string }) => {
      setIsAiEnhancing(index);
      
      return apiRequest("/api/ai/enhance-job-description", {
        method: "POST",
        body: JSON.stringify({
          jobTitle,
          company,
          currentDescription: form.getValues(`experiences.${index}.description`),
        }),
      });
    },
    onSuccess: (data, variables) => {
      form.setValue(`experiences.${variables.index}.description`, data.enhancedDescription);
      setIsAiEnhancing(null);
      toast({
        title: "AI Enhancement Complete",
        description: "Job description has been enhanced",
      });
    },
    onError: () => {
      setIsAiEnhancing(null);
      toast({
        title: "AI Enhancement Failed",
        description: "Could not enhance description at this time",
        variant: "destructive",
      });
    },
  });

  const addExperience = () => {
    append({
      jobTitle: "",
      company: "",
      location: "",
      startMonth: new Date().getMonth() + 1,
      startYear: new Date().getFullYear(),
      endMonth: undefined,
      endYear: undefined,
      isPresent: false,
      description: "",
      achievements: [],
    });
  };

  const addAchievement = (experienceIndex: number) => {
    const currentAchievements = form.getValues(`experiences.${experienceIndex}.achievements`) || [];
    form.setValue(`experiences.${experienceIndex}.achievements`, [...currentAchievements, ""]);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const currentAchievements = form.getValues(`experiences.${experienceIndex}.achievements`) || [];
    const newAchievements = currentAchievements.filter((_, i) => i !== achievementIndex);
    form.setValue(`experiences.${experienceIndex}.achievements`, newAchievements);
  };

  const onSubmit = (data: WorkExperienceFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="loading-skeleton h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gold-primary">Work Experience</h3>
        <button
          type="button"
          onClick={addExperience}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No work experience added yet</p>
          <button
            type="button"
            onClick={addExperience}
            className="btn-primary mt-4"
          >
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="card-glass p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gold-primary">Experience {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    Job Title *
                  </label>
                  <input
                    {...form.register(`experiences.${index}.jobTitle`)}
                    className="form-input"
                    placeholder="Software Engineer"
                  />
                  {form.formState.errors.experiences?.[index]?.jobTitle && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.experiences[index]?.jobTitle?.message}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    Company *
                  </label>
                  <input
                    {...form.register(`experiences.${index}.company`)}
                    className="form-input"
                    placeholder="Tech Corp"
                  />
                  {form.formState.errors.experiences?.[index]?.company && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.experiences[index]?.company?.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Location
                  </label>
                  <input
                    {...form.register(`experiences.${index}.location`)}
                    className="form-input"
                    placeholder="San Francisco, CA"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Start Date *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      {...form.register(`experiences.${index}.startMonth`, { valueAsNumber: true })}
                      className="form-select"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select
                      {...form.register(`experiences.${index}.startYear`, { valueAsNumber: true })}
                      className="form-select"
                    >
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    End Date
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...form.register(`experiences.${index}.isPresent`)}
                        className="rounded border-gray-600 bg-deep-black text-gold-primary focus:ring-gold-primary"
                      />
                      <span className="text-sm text-gray-300">Currently working here</span>
                    </div>
                    {!form.watch(`experiences.${index}.isPresent`) && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          {...form.register(`experiences.${index}.endMonth`, { valueAsNumber: true })}
                          className="form-select"
                        >
                          <option value="">Month</option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                        <select
                          {...form.register(`experiences.${index}.endYear`, { valueAsNumber: true })}
                          className="form-select"
                        >
                          <option value="">Year</option>
                          {years.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gold-primary">
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const jobTitle = form.getValues(`experiences.${index}.jobTitle`);
                      const company = form.getValues(`experiences.${index}.company`);
                      if (jobTitle && company) {
                        enhanceDescriptionMutation.mutate({ index, jobTitle, company });
                      }
                    }}
                    disabled={isAiEnhancing === index}
                    className="text-xs btn-secondary py-1 px-3"
                  >
                    {isAiEnhancing === index ? "Enhancing..." : "✨ AI Enhance"}
                  </button>
                </div>
                <textarea
                  {...form.register(`experiences.${index}.description`)}
                  rows={3}
                  className="form-textarea"
                  placeholder="Brief overview of your role and responsibilities..."
                />
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gold-primary">
                    Key Achievements
                  </label>
                  <button
                    type="button"
                    onClick={() => addAchievement(index)}
                    className="text-xs btn-secondary py-1 px-3 flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Achievement</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {form.watch(`experiences.${index}.achievements`)?.map((achievement: any, achievementIndex: number) => (
                    <div key={achievementIndex} className="flex items-start space-x-2">
                      <span className="text-gold-primary mt-2">•</span>
                      <input
                        {...form.register(`experiences.${index}.achievements.${achievementIndex}`)}
                        className="form-input flex-1"
                        placeholder="Improved system performance by 40%..."
                      />
                      <button
                        type="button"
                        onClick={() => removeAchievement(index, achievementIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors mt-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {(!form.watch(`experiences.${index}.achievements`) || form.watch(`experiences.${index}.achievements`)?.length === 0) && (
                    <p className="text-xs text-gray-400">
                      Add specific, quantifiable achievements to make your experience stand out.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {fields.length > 0 && (
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="btn-primary flex-1"
          >
            {saveMutation.isPending ? "Saving..." : "Save Work Experience"}
          </button>
        </div>
      )}
    </form>
  );
}
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Calendar, MapPin, Plus, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const educationSchema = z.object({
  education: z.array(z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().optional(),
    location: z.string().optional(),
    startMonth: z.number().min(1).max(12),
    startYear: z.number().min(1950),
    endMonth: z.number().min(1).max(12).optional(),
    endYear: z.number().min(1950).optional(),
    isPresent: z.boolean().default(false),
    gpa: z.string().optional(),
    achievements: z.array(z.string().min(1)).default([]),
  })).default([]),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  resumeId: string;
  onSave?: (data: EducationFormData) => void;
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

export default function EducationForm({ resumeId, onSave }: EducationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  useEffect(() => {
    if (resume?.education) {
      form.reset({
        education: resume.education.map((edu: any) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          fieldOfStudy: edu.fieldOfStudy || "",
          location: edu.location || "",
          startMonth: edu.startMonth || 1,
          startYear: edu.startYear || new Date().getFullYear(),
          endMonth: edu.endMonth || undefined,
          endYear: edu.endYear || undefined,
          isPresent: edu.isPresent || false,
          gpa: edu.gpa || "",
          achievements: edu.achievements || [],
        })),
      });
    }
  }, [resume, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: EducationFormData) => {
      return apiRequest(`/api/resumes/${resumeId}/education`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      onSave?.(form.getValues());
      toast({
        title: "Success",
        description: "Education saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive",
      });
    },
  });

  const addEducation = () => {
    append({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startMonth: new Date().getMonth() + 1,
      startYear: new Date().getFullYear(),
      endMonth: undefined,
      endYear: undefined,
      isPresent: false,
      gpa: "",
      achievements: [],
    });
  };

  const addAchievement = (educationIndex: number) => {
    const currentAchievements = form.getValues(`education.${educationIndex}.achievements`) || [];
    form.setValue(`education.${educationIndex}.achievements`, [...currentAchievements, ""]);
  };

  const removeAchievement = (educationIndex: number, achievementIndex: number) => {
    const currentAchievements = form.getValues(`education.${educationIndex}.achievements`) || [];
    const newAchievements = currentAchievements.filter((_, i) => i !== achievementIndex);
    form.setValue(`education.${educationIndex}.achievements`, newAchievements);
  };

  const onSubmit = (data: EducationFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="loading-skeleton h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gold-primary">Education</h3>
        <button
          type="button"
          onClick={addEducation}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No education added yet</p>
          <button
            type="button"
            onClick={addEducation}
            className="btn-primary mt-4"
          >
            Add Your Education
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="card-glass p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gold-primary">Education {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    Institution *
                  </label>
                  <input
                    {...form.register(`education.${index}.institution`)}
                    className="form-input"
                    placeholder="University of California, Berkeley"
                  />
                  {form.formState.errors.education?.[index]?.institution && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.education[index]?.institution?.message}
                    </p>
                  )}
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    Degree *
                  </label>
                  <input
                    {...form.register(`education.${index}.degree`)}
                    className="form-input"
                    placeholder="Bachelor of Science"
                  />
                  {form.formState.errors.education?.[index]?.degree && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.education[index]?.degree?.message}
                    </p>
                  )}
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    Field of Study
                  </label>
                  <input
                    {...form.register(`education.${index}.fieldOfStudy`)}
                    className="form-input"
                    placeholder="Computer Science"
                  />
                </div>

                {/* GPA */}
                <div>
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    GPA
                  </label>
                  <input
                    {...form.register(`education.${index}.gpa`)}
                    className="form-input"
                    placeholder="3.8/4.0"
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gold-primary mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Location
                  </label>
                  <input
                    {...form.register(`education.${index}.location`)}
                    className="form-input"
                    placeholder="Berkeley, CA"
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
                      {...form.register(`education.${index}.startMonth`, { valueAsNumber: true })}
                      className="form-select"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select
                      {...form.register(`education.${index}.startYear`, { valueAsNumber: true })}
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
                        {...form.register(`education.${index}.isPresent`)}
                        className="rounded border-gray-600 bg-deep-black text-gold-primary focus:ring-gold-primary"
                      />
                      <span className="text-sm text-gray-300">Currently enrolled</span>
                    </div>
                    {!form.watch(`education.${index}.isPresent`) && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          {...form.register(`education.${index}.endMonth`, { valueAsNumber: true })}
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
                          {...form.register(`education.${index}.endYear`, { valueAsNumber: true })}
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

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gold-primary">
                    Academic Achievements
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
                  {form.watch(`education.${index}.achievements`)?.map((achievement: any, achievementIndex: number) => (
                    <div key={achievementIndex} className="flex items-start space-x-2">
                      <span className="text-gold-primary mt-2">•</span>
                      <input
                        {...form.register(`education.${index}.achievements.${achievementIndex}`)}
                        className="form-input flex-1"
                        placeholder="Dean's List, Magna Cum Laude, etc..."
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
                  {(!form.watch(`education.${index}.achievements`) || form.watch(`education.${index}.achievements`)?.length === 0) && (
                    <p className="text-xs text-gray-400">
                      Add honors, awards, relevant coursework, or other academic achievements.
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
            {saveMutation.isPending ? "Saving..." : "Save Education"}
          </button>
        </div>
      )}
    </form>
  );
}
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code, Plus, Trash2, X, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const skillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, "Skill name is required"),
    category: z.string().min(1, "Category is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  })).default([]),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  resumeId: string;
  onSave?: (data: SkillsFormData) => void;
}

const skillCategories = [
  "Programming Languages",
  "Web Technologies",
  "Databases",
  "Cloud Platforms",
  "DevOps & Tools",
  "Frameworks & Libraries",
  "Design & Creative",
  "Project Management",
  "Soft Skills",
  "Languages",
  "Other",
];

const skillLevels = [
  { value: "Beginner", label: "Beginner", stars: 1 },
  { value: "Intermediate", label: "Intermediate", stars: 2 },
  { value: "Advanced", label: "Advanced", stars: 3 },
  { value: "Expert", label: "Expert", stars: 4 },
];

const popularSkills = {
  "Programming Languages": ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go", "Rust", "Swift"],
  "Web Technologies": ["React", "HTML", "CSS", "Vue.js", "Angular", "Node.js", "Next.js", "Svelte"],
  "Databases": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Firebase", "DynamoDB"],
  "Cloud Platforms": ["AWS", "Google Cloud", "Azure", "Vercel", "Heroku", "DigitalOcean"],
  "DevOps & Tools": ["Docker", "Kubernetes", "Git", "CI/CD", "Jenkins", "Terraform", "Linux"],
  "Frameworks & Libraries": ["Express.js", "Django", "Flask", "Spring Boot", "Laravel", "Rails"],
  "Design & Creative": ["Figma", "Adobe Creative Suite", "Sketch", "UI/UX Design", "Graphic Design"],
  "Project Management": ["Agile", "Scrum", "Kanban", "Jira", "Trello", "Asana"],
  "Soft Skills": ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Critical Thinking"],
  "Languages": ["English", "Spanish", "French", "German", "Mandarin", "Japanese"],
};

export default function SkillsForm({ resumeId, onSave }: SkillsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("Programming Languages");

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", resumeId],
  });

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  useEffect(() => {
    if (resume?.skills) {
      form.reset({
        skills: resume.skills.map((skill: any) => ({
          name: skill.name || "",
          category: skill.category || "Other",
          level: skill.level || "Intermediate",
        })),
      });
    }
  }, [resume, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: SkillsFormData) => {
      return apiRequest(`/api/resumes/${resumeId}/skills`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", resumeId] });
      onSave?.(form.getValues());
      toast({
        title: "Success",
        description: "Skills saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save skills",
        variant: "destructive",
      });
    },
  });

  const addSkill = (skillName?: string, category?: string) => {
    append({
      name: skillName || "",
      category: category || selectedCategory,
      level: "Intermediate",
    });
  };

  const onSubmit = (data: SkillsFormData) => {
    saveMutation.mutate(data);
  };

  const getSkillsByCategory = () => {
    return form.watch("skills").reduce((acc: any, skill: any) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="loading-skeleton h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gold-primary">Skills</h3>
        <button
          type="button"
          onClick={() => addSkill()}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* Quick Add Popular Skills */}
      <div className="card-glass p-6">
        <h4 className="text-md font-medium text-gold-primary mb-4">Quick Add Popular Skills</h4>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {skillCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-gold-primary text-deep-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {popularSkills[selectedCategory as keyof typeof popularSkills]?.map((skill) => {
            const isAlreadyAdded = form.watch("skills").some((s: any) => s.name.toLowerCase() === skill.toLowerCase());
            return (
              <button
                key={skill}
                type="button"
                onClick={() => !isAlreadyAdded && addSkill(skill, selectedCategory)}
                disabled={isAlreadyAdded}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  isAlreadyAdded
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gold-primary/20 text-gold-primary hover:bg-gold-primary/30 border border-gold-primary/30"
                }`}
              >
                {skill} {isAlreadyAdded && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Skills */}
      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No skills added yet</p>
          <button
            type="button"
            onClick={() => addSkill()}
            className="btn-primary mt-4"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(getSkillsByCategory()).map(([category, categorySkills]: [string, any]) => (
            <div key={category} className="card-glass p-6">
              <h4 className="text-md font-medium text-gold-primary mb-4">{category}</h4>
              <div className="space-y-4">
                {categorySkills.map((skill: any, index: number) => {
                  const globalIndex = form.watch("skills").findIndex((s: any) => s === skill);
                  return (
                    <div key={globalIndex} className="flex items-center space-x-4">
                      {/* Skill Name */}
                      <div className="flex-1">
                        <input
                          {...form.register(`skills.${globalIndex}.name`)}
                          className="form-input"
                          placeholder="Skill name"
                        />
                        {form.formState.errors.skills?.[globalIndex]?.name && (
                          <p className="text-red-400 text-xs mt-1">
                            {form.formState.errors.skills[globalIndex]?.name?.message}
                          </p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="w-48">
                        <select
                          {...form.register(`skills.${globalIndex}.category`)}
                          className="form-select"
                        >
                          {skillCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level */}
                      <div className="w-40">
                        <select
                          {...form.register(`skills.${globalIndex}.level`)}
                          className="form-select"
                        >
                          {skillLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level Stars */}
                      <div className="flex space-x-1">
                        {Array.from({ length: 4 }, (_, i) => {
                          const currentLevel = form.watch(`skills.${globalIndex}.level`);
                          const levelStars = skillLevels.find(l => l.value === currentLevel)?.stars || 2;
                          return (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < levelStars ? "text-gold-primary fill-current" : "text-gray-600"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => remove(globalIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
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
            {saveMutation.isPending ? "Saving..." : "Save Skills"}
          </button>
        </div>
      )}
    </form>
  );
}
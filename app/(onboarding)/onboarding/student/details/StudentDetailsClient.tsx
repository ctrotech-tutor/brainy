// app/onboarding/student/details/StudentDetailsClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2, University } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentDetailsSchema, type StudentDetailsInput } from "@/lib/validations/onboarding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InstitutionAPIResult } from "@/app/(onboarding)/_types";

// Helper function to fetch institutions from our API
const fetchInstitutions = async () => {
  const { data } = await axios.get<InstitutionAPIResult[]>("/api/onboarding/institution/list");
  return data;
};

// Helper function to fetch faculties for a selected institution
const fetchFaculties = async (institutionId: string) => {
  if (!institutionId) return [];
  const { data } = await axios.get(`/api/onboarding/institution/${institutionId}/faculties`);
  return data;
};

// Helper function to fetch departments for a selected faculty
const fetchDepartments = async (institutionId: string, facultyId: string) => {
  if (!institutionId || !facultyId) return [];
  const { data } = await axios.get(
    `/api/onboarding/institution/${institutionId}/faculties/${facultyId}/departments`
  );
  return data;
};

const submitStudentDetails = async (data: StudentDetailsInput) => {
  const response = await axios.post("/api/onboarding/student", data);
  return response.data;
};

export default function StudentDetailsClient() {
  const router = useRouter();

  const form = useForm<StudentDetailsInput>({
    resolver: zodResolver(studentDetailsSchema),
    defaultValues: {
      institutionId: "",
      facultyId: "",
      departmentId: "",
      matricNumber: "",
      institutionalEmail: "",
    },
  });

  // Watch fields to trigger dependent queries
  const institutionId = form.watch("institutionId");
  const facultyId = form.watch("facultyId");

  // Queries
  const { data: institutions, isPending: isLoadingInstitutions } = useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions,
  });

  const { data: faculties, isPending: isLoadingFaculties } = useQuery({
    queryKey: ["faculties", institutionId],
    queryFn: () => fetchFaculties(institutionId),
    enabled: !!institutionId,
  });

  const { data: departments, isPending: isLoadingDepartments } = useQuery({
    queryKey: ["departments", institutionId, facultyId],
    queryFn: () => fetchDepartments(institutionId, facultyId),
    enabled: !!institutionId && !!facultyId,
  });

  // Mutation
  const { mutate: submitForm, isPending: isSubmitting } = useMutation({
    mutationFn: submitStudentDetails,
    onSuccess: (data) => {
      toast.success("Student profile created!");
      router.push(`/onboarding/student/verify-email?token=${data.verificationToken}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit details.");
    },
  });

  const onSubmit = (data: StudentDetailsInput) => {
    submitForm(data);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted/40 p-10 text-center">
        <div className="aurora-bg" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-background/50 text-primary">
            <University className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">
            Student Profile
          </h1>
          <p className="mt-4 max-w-sm text-lg text-foreground/80">
            Tell us about your academic journey. This information helps us verify your student status.
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                  <CardDescription>
                    Select your institution and course of study.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Institution */}
                  <FormField
                    control={form.control}
                    name="institutionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("facultyId", ""); // Reset dependent fields
                            form.setValue("departmentId", "");
                          }}
                          defaultValue={field.value}
                          disabled={isLoadingInstitutions}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your school" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {institutions?.map((inst: any) => (
                              <SelectItem key={inst.id} value={inst.id}>
                                {inst.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Faculty */}
                  <FormField
                    control={form.control}
                    name="facultyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("departmentId", "");
                          }}
                          defaultValue={field.value}
                          disabled={!institutionId || isLoadingFaculties}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your faculty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {faculties?.map((faculty: any) => (
                              <SelectItem key={faculty.id} value={faculty.id}>
                                {faculty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Department */}
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!facultyId || isLoadingDepartments}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Matriculation Number */}
                  <FormField
                    control={form.control}
                    name="matricNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matriculation Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              placeholder="e.g. 19/SCI01/001"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This will be verified against your school records.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Institutional Email */}
                  <FormField
                    control={form.control}
                    name="institutionalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type="email"
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              placeholder="e.g. john.doe@university.edu"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Use your official university email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

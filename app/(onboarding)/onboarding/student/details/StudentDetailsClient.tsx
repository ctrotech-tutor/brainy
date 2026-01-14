"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2, University, GraduationCap, ShieldCheck, Mail, Hash } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { studentDetailsSchema, type StudentDetailsInput } from "@/lib/validations/onboarding";
import { InstitutionAPIResult } from "@/app/(onboarding)/_types";

// Helper functions for API interaction
const fetchInstitutions = async () => {
  const { data } = await axios.get<InstitutionAPIResult[]>("/api/onboarding/institution/list");
  return data;
};

const fetchFaculties = async (institutionId: string) => {
  if (!institutionId) return [];
  const { data } = await axios.get(`/api/onboarding/institution/${institutionId}/faculties`);
  return data;
};

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
      toast.success("Identity Handshake: Success.");
      router.push(`/onboarding/student/verify-email?token=${data.verificationToken}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Shield Active: Submission blocked.");
    },
  });

  const onSubmit = (data: StudentDetailsInput) => submitForm(data);

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <University className="h-3 w-3" />
          Protocol Sequence 03
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">
          Academic <span className="text-primary italic">Matrix.</span>
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Populate your profile with verified institutional data.
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Institution */}
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Institution</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("facultyId", "");
                        form.setValue("departmentId", "");
                      }}
                      defaultValue={field.value}
                      disabled={isLoadingInstitutions}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md">
                          <SelectValue placeholder="Select Institution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-white/5">
                        {institutions?.map((inst: any) => (
                          <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              {/* Faculty */}
              <FormField
                control={form.control}
                name="facultyId"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Faculty</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("departmentId", "");
                      }}
                      defaultValue={field.value}
                      disabled={!institutionId || isLoadingFaculties}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md">
                          <SelectValue placeholder="Select Faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-white/5">
                        {faculties?.map((faculty: any) => (
                          <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>

            {/* Department */}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Department / Department Area</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!facultyId || isLoadingDepartments}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card/95 backdrop-blur-xl border-white/5">
                      {departments?.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matric Number */}
              <FormField
                control={form.control}
                name="matricNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Matriculation ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          placeholder="e.g. 19/SCI01/001"
                          className="h-12 pl-10 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              {/* Institutional Email */}
              <FormField
                control={form.control}
                name="institutionalEmail"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Institutional Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          type="email"
                          placeholder="john.doe@university.edu"
                          className="h-12 pl-10 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
                Your institutional data is cross-referenced with official records to ensure academic integrity.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group h-16 w-full max-w-sm rounded-[1.25rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Verify Academic Status
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <GraduationCap className="h-3 w-3" />
              Change Role Selection
            </button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}

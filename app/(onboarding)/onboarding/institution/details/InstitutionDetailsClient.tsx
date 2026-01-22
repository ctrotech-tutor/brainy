"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Building, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import our custom hook and step components
import {
  useInstitutionForm,
  type FullInstitutionInput,
} from "./_hooks/useInstitutionForm";
import { Step1_SelectCountry } from "./_components/Step1_SelectCountry";
import { Step2_SelectInstitution } from "./_components/Step2_SelectInstitution";
import { Step3_Identity } from "./_components/Step3_Identity";
import { Step4_Regulatory } from "./_components/Step4_Regulatory";
import { Step5_AccessContact } from "./_components/Step5_AccessContact";

// UI Imports
import { Button } from "@/components/ui/button";

// API mutation function
const submitInstitutionDetails = async (data: FullInstitutionInput) => {
  const { data: responseData } = await axios.post(
    "/api/onboarding/institution",
    data
  );
  return responseData;
};

export default function InstitutionDetailsClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const { form } = useInstitutionForm();
  const { trigger, handleSubmit } = form;

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: submitInstitutionDetails,
    onSuccess: (data) => {
      toast.success("Registry Sequence Handshake: Success.");
      router.push(
        `/onboarding/institution/verify-email?token=${data.verificationToken}`
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Shield Active: Registry collision detected."
      );
    },
  });

  const steps = [
    {
      number: 1,
      title: "Jurisdiction Node",
      component: <Step1_SelectCountry />,
      fields: ["state", "lga", "institutionType"] as const,
    },
    {
      number: 2,
      title: "Entity Identification",
      component: <Step2_SelectInstitution />,
      fields: ["name", "domain", "logo", "website", "ownership", "yearEstablished"] as const,
    },
    {
      number: 3,
      title: "Identity Parameters",
      component: <Step3_Identity />,
      fields: ["shortName", "motto", "description", "mission", "vision"] as const,
    },
    {
      number: 4,
      title: "Regulatory Protocols",
      component: <Step4_Regulatory />,
      fields: ["nucCode", "nbteCode", "accreditationNumber", "studentPopulation"] as const,
    },
    {
      number: 5,
      title: "Access & Logistics",
      component: <Step5_AccessContact />,
      fields: ["adminEmail", "phoneNumber", "alternativePhone", "address"] as const,
    },
  ];

  const handleNextStep = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: FullInstitutionInput) => submitForm(data);

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <Building className="h-3 w-3" />
          Protocol Sequence 02
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">
          Institutional <span className="text-primary italic">Registry.</span>
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Define the administrative parameters for your educational infrastructure.
        </p>
      </motion.div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          <div className="relative p-8 rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              />
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">Step 0{currentStep}</div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">{steps[currentStep - 1].title}</h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-muted-foreground">
                  {currentStep}/{steps.length}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {steps[currentStep - 1].component}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-between w-full max-w-sm gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="h-14 flex-1 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Prev Phase
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="h-14 flex-[2] rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Next Progress Phase
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-14 flex-[2] rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Initiate Registry
                      <ShieldCheck className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">
              <Sparkles className="h-3 w-3" />
              Registry integrity audited via SHA-384
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

// app/(onboarding)/onboarding/institution/details/InstitutionDetailsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Check, Building } from "lucide-react";

// Import our custom hook and step components
import {
  useInstitutionForm,
  type FullInstitutionInput,
} from "./_hooks/useInstitutionForm";
import { Step1_SelectCountry } from "./_components/Step1_SelectCountry";
import { Step2_SelectInstitution } from "./_components/Step2_SelectInstitution";
import { Step3_AdminDetails } from "./_components/Step3_AdminDetails";

// UI Imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      toast.success(data.message || "Details submitted successfully!");
      router.push(
        `/onboarding/institution/verify-email?token=${data.verificationToken}`
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    },
  });

  const steps = [
    {
      number: 1,
      title: "Select Location",
      component: <Step1_SelectCountry />,
      fields: ["country", "institutionType"] as const,
    },
    {
      number: 2,
      title: "Find Institution",
      component: <Step2_SelectInstitution />,
      fields: ["name", "domain"] as const,
    },
    {
      number: 3,
      title: "Administrator Details",
      component: <Step3_AdminDetails />,
      fields: ["adminEmail"] as const,
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

  // The correct wrapper function for the final submission
  const onSubmit = (data: FullInstitutionInput) => {
    submitForm(data);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted/40 p-10 text-center">
        <div className="aurora-bg" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-background/50 text-primary">
            <Building className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">
            Institution Details
          </h1>
          <p className="mt-4 max-w-sm text-lg text-foreground/80">
            Accurate information is the first step toward getting your
            institution verified and active on the platform.
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-lg">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{steps[currentStep - 1].title}</span>
                    <Badge variant="outline">
                      Step {currentStep} of {steps.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Please provide the following details.
                  </CardDescription>
                </CardHeader>
                <CardContent>{steps[currentStep - 1].component}</CardContent>
              </Card>

              <div className="flex justify-between items-center">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNextStep}>
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit for Verification
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

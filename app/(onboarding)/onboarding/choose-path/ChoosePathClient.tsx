// app/(onboarding)/onboarding/choose-path/ChoosePathClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/ui/wrapper";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { RoleSelector } from "@/components/get-started/role-selector";
import { roleData, type SelectableRole } from "@/lib/roles";

export default function ChoosePathClient() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<SelectableRole>("student");

  const { mutate: setIntent, isPending } = useMutation({
    mutationFn: async (intent: SelectableRole) => {
      const response = await axios.post("/api/onboarding/intent", { intent });
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to the next step returned by the API
      router.push(data.nextStep || `/onboarding/${activeRole}/start`);
    },
    onError: (error: any) => {
      toast.error("Failed to set onboarding path. Please try again.");
      console.error(error);
    }
  });

  const handleContinue = () => {
    setIntent(activeRole);
  };

  const activeData = roleData[activeRole];
  const ActiveVisual = activeData.visual;

  return (
    <Wrapper className="relative flex flex-1 flex-col items-center justify-center text-center my-5">
      <AnimatePresence>
        <motion.div
          key={activeRole}
          className="absolute inset-0 -z-10 h-full w-full bg-linear-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
        />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
          Welcome to Brainy
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Let&apos;s get you started. First, tell us who you are.
        </p>

        <div className="mx-auto mt-10 max-w-lg">
          <RoleSelector activeRole={activeRole} setActiveRole={setActiveRole} />
        </div>

        <div className="relative mt-10 flex min-h-70 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <ActiveVisual />
              <p className="max-w-sm text-lg text-foreground">
                {activeData.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          key={activeRole + "-button"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="group w-full max-w-sm text-lg"
            onClick={handleContinue}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Continue as a {activeData.title}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </Wrapper>
  );
}

// app/(onboarding)/onboarding/complete/OnboardingCompleteClient.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingCompleteClient() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Wrapper className="flex flex-1 flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
        </motion.div>

        <h1 className="mt-6 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
          Setup Complete!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You're all set. Redirecting you to your dashboard now...
        </p>
      </motion.div>
    </Wrapper>
  );
}

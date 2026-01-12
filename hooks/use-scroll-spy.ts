// hooks/use-scroll-spy.ts
"use client";
import { useState, useEffect, useRef } from "react";

export const useScrollSpy = (ids: string[]) => {
  const [activeId, setActiveId] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id.substring(1)));

    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" } // Highlights when section is in the middle 30% of the screen
    );

    elements.forEach((el) => {
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [ids]);

  return activeId;
};

// Helper function for smooth scrolling
export const smoothScrollTo = (id: string) => {
  const element = document.getElementById(id.substring(1));
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

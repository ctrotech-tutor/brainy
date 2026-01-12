// config/site.ts
export const siteConfig = {
  name: "Brainy",
  url: "https://brayni.vercel.app", // Replace with your final domain
  ogImage: "/brainy_og_image.png", // Place in the `public` folder (1200x630 )
  description:
    "Brainy transforms university learning through intelligent assessments, real-time analytics, and personalized feedback.",
  title: "Master Your Courses with Smart Quizzes",
  keywords: [
    "university quizzes",
    "academic assessment",
    "student analytics",
    "online learning",
    "e-learning",
    "study tools",
  ],
  author: "The Brainy Team",
  twitterHandle: "@ctrotech", // Replace with your actual Twitter handle
};

export type SiteConfig = typeof siteConfig;

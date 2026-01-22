// scripts/seed-blog.ts
import "dotenv/config";
import { db } from "../db";
import { 
  users, 
  blogPosts, 
  blogCategories, 
  blogTags, 
  blogPostTags 
} from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const categories = [
  { name: "EdTech Trends", slug: "edtech-trends", description: "Insights into the future of educational technology." },
  { name: "Platform Updates", slug: "platform-updates", description: "News and release notes from the Brainy team." },
  { name: "Pedagogy & Learning", slug: "pedagogy-learning", description: "Best practices for teaching and assessment." },
  { name: "Institutional Success", slug: "institutional-success", description: "Case studies and strategies for schools." },
  { name: "Artificial Intelligence", slug: "artificial-intelligence", description: "Exploring AI's role in modern education." }
];

const tags = [
  { name: "AI", slug: "ai" },
  { name: "Assessment", slug: "assessment" },
  { name: "Security", slug: "security" },
  { name: "Case Study", slug: "case-study" },
  { name: "Productivity", slug: "productivity" },
  { name: "New Feature", slug: "new-feature" },
  { name: "Integrity", slug: "integrity" },
  { name: "Remote Learning", slug: "remote-learning" }
];

const posts = [
  {
    title: "The Future of AI in Academic Assessment",
    slug: "future-of-ai-in-academic-assessment",
    excerpt: "Discover how Artificial Intelligence is transforming the way institutions evaluate student performance, ensuring fairness and efficiency at scale.",
    content: `
# The Future of AI in Academic Assessment

The landscape of academic assessment is undergoing a seismic shift. With the advent of advanced Artificial Intelligence models, the traditional methods of grading and evaluating student performance are being reimagined for a digital-first world.

## Beyond Multiple Choice

Historically, automated grading was limited to multiple-choice questions (MCQs). While efficient, MCQs often fail to capture the depth of a student's understanding. AI changes this equation by enabling:
- **Semantic Analysis:** Understanding the *meaning* behind a student's written response, not just keyword matching.
- **Contextual Grading:** Evaluating answers based on the specific context of the course material.
- **Instant Feedback:** Providing students with immediate, actionable insights rather than just a letter grade.

## Enhancing Fairness

One of the most significant advantages of AI in assessment is the reduction of unconscious bias. Algorithms, when properly trained, apply the same standard to every student, regardless of their background or identity. This consistency ensures that grades are a true reflection of capability.

## The Human Element

It is important to note that AI is not a replacement for educators. Rather, it is a powerful tool in their arsenal. By handling the repetitive task of grading standard assessments, AI frees up tutors to focus on mentorship, complex problem-solving, and personalized student support.

## Conclusion

As we continue to integrate AI into platforms like Brainy, our goal remains clear: to empower institutions to deliver world-class education with efficiency and integrity. The future of assessment is here, and it is intelligent.
    `,
    category: "Artificial Intelligence",
    tags: ["AI", "Assessment", "Productivity"],
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    readingTime: 5
  },
  {
    title: "Introducing Brainy: The Institutional Operating System",
    slug: "introducing-brainy-institutional-os",
    excerpt: "Welcome to a new era of academic management. Learn how Brainy centralizes operations, assessment, and integrity for modern institutions.",
    content: `
# Introducing Brainy: The Institutional Operating System

We are thrilled to officially unveil Brainy, the comprehensive operating system designed specifically for the modern academic institution. Brainy is not just an LMS; it is a unified ecosystem that bridges the gap between administration, instruction, and student success.

## Why We Built Brainy

Educational institutions today are fragmented. They rely on a patchwork of tools for grading, enrollment, communication, and integrity checks. This fragmentation leads to:
- **Data Silos:** Critical student performance data is trapped in disconnected systems.
- **Security Vulnerabilities:** Managing access across multiple platforms increases the risk of unauthorized access.
- **Operational Inefficiency:** Administrators waste countless hours syncing data manually.

Brainy solves these problems by providing a single, secure, and scalable platform.

## Key Capabilities

### 1. Unified Identity Management
With secure, role-based access control, Brainy ensures that the right people have the right access. From Platform Admins to Students, every interaction is authenticated and logged.

### 2. High-Integrity Assessments
Our flagship quiz engine leverages advanced anti-cheating measures and AI-assisted grading to integrity of every exam.

### 3. Institutional Analytics
Real-time dashboards provide deep insights into faculty performance, student engagement, and overall institutional health.

## Getting Started

Brainy is now available for enterprise deployment. Contact our sales team to schedule a demo and see how Brainy can transform your institution.
    `,
    category: "Platform Updates",
    tags: ["New Feature", "Productivity", "Security"],
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    readingTime: 4
  },
  {
    title: "How to Prevent Academic Dishonesty in Remote Exams",
    slug: "preventing-academic-dishonesty-remote-exams",
    excerpt: "Remote learning brings new challenges for integrity. Explore actionable strategies and technical safeguards to maintain high standards.",
    content: `
# How to Prevent Academic Dishonesty in Remote Exams

The shift to remote learning has democratized access to education, but it has also introduced significant challenges regarding academic integrity. Without the physical supervision of an invigilator, maintaining the sanctity of exams requires a new approach.

## The Challenge of Remote Integrity

Traditional methods of proctoring are often intrusive or technically demanding. Students may face privacy concerns with webcam monitoring, while institutions struggle with the cost of live proctoring services.

## Technical Safeguards

Brainy approaches this problem with a multi-layered security strategy:
1.  **Browser Lockdown:** Preventing simple copy-paste actions and tab switching during high-stakes assessments.
2.  **Randomized Question Pools:** Ensuring that no two students receive the exact same set of questions in the same order.
3.  **Time-Limit Constraints:** meaningful time pressure reduces the window of opportunity for external collaboration.

## Designing Better Questions

Technology is only half the battle. The most effective deterrent against cheating is better question design.
- **Application over Recall:** Ask students to apply concepts to new scenarios rather than simply reciprocating facts.
- **Open-Ended Queries:** Questions that require unique, synthesized answers are inherently resistant to simple searching.

## Trust as a Foundation

Ultimately, a culture of integrity is built on trust. By communicating clear expectations and providing fair, reliable assessment tools, institutions can foster an environment where honesty is the norm, not the exception.
    `,
    category: "Pedagogy & Learning",
    tags: ["Integrity", "Remote Learning", "Security"],
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    readingTime: 6
  },
  {
    title: "Scaling Institutional Assessments: A Case Study",
    slug: "scaling-institutional-assessments-case-study",
    excerpt: "See how a leading regional university streamlined their midterm evaluations for 5,000+ students using Brainy's automated workflows.",
    content: `
# Scaling Institutional Assessments: A Case Study

Large-scale assessments are a logistical nightmare. Printing papers, securing venues, and coordinating hundreds of invigilators is costly and error-prone. This case study explores how **West African Regional University (WARU)** leveraged Brainy to digitize their midterm evaluations.

## The Problem

WARU faced a critical bottleneck: grading lag. With over 5,000 students enrolled in General Studies courses, it took weeks to manually grade papers. This delay meant students received feedback too late to impact their final exam preparations.

## The Solution: Automated Pipelines

WARU deployed Brainy's "Assessment Pipeline" feature to handle the load.
1.  **Digital Distribution:** Exams were released simultaneously to all qualified students via the secure student portal.
2.  **AI-Assisted Grading:** For objective questions, grading was instant. For essay questions, Brainy's AI grouped similar answers, allowing tutors to grade in batches.
3.  **Instant Analytics:** The administration had a real-time view of completion rates and average scores as the exam was happening.

## The Results

- **90% Reduction in Grading Time:** Results were released within 48 hours, compared to the previous 3-week standard.
- **Zero Verified Incidents of Leakage:** Digital distribution eliminated the physical chain of custody risks.
- **Cost Savings:** The university saved significantly on printing and logistics costs.

## Conclusion

WARU's success demonstrates that digital transformation is not just about convenience—it's about fundamentally improving the operational capacity of the institution.
    `,
    category: "Institutional Success",
    tags: ["Case Study", "Productivity", "Assessment"],
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    readingTime: 7
  },
  {
    title: "Understanding Role-Based Access Control in Education",
    slug: "role-based-access-control-education",
    excerpt: "Security starts with access. Learn why RBAC is critical for protecting sensitive student data and institutional hierarchies.",
    content: `
# Understanding Role-Based Access Control in Education

In the digital age, data security is paramount. For educational institutions holding sensitive data on minors and young adults, the responsibility is even greater. Role-Based Access Control (RBAC) is the industry standard for managing this responsibility.

## What is RBAC?

RBAC creates distinct 'zones' of authority. Instead of giving every user blanket access, permissions are tied to their function within the institution.

## Brainy's Implementation

Brainy uses a strict hierarchical model:
1.  **Platform Admin:** System-wide oversight. Can manage institutions but cannot see private student messages.
2.  **Institution Admin:** Full control over their specific campus. Can add tutors and manage enrollments.
3.  **Tutor:** Can creating content and grade their assigned courses. Cannot modify institutional settings.
4.  **Student:** Can consume content and take assessments. No administrative privileges.

## Why It Matters

- **Data Privacy:** A tutor in the Science department shouldn't have access to the grades of an Arts student.
- **Audit Trails:** When an action is taken, RBAC allows us to know exactly *who* did it and *by what authority*.
- **Operational Safety:** Reducing the number of "super-users" minimizes the risk of accidental system-wide errors.

Security is not a feature; it is the foundation of the Brainy platform.
    `,
    category: "EdTech Trends",
    tags: ["Security", "Productivity"],
    coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
    readingTime: 5
  },
  {
    title: "The Psychology of Testing: Reducing Student Anxiety",
    slug: "psychology-of-testing-student-anxiety",
    excerpt: "High-stakes testing often leads to high-stress situations. Discover how UI/UX design can create a calmer, more focused assessment environment.",
    content: `
# The Psychology of Testing: Reducing Student Anxiety

Test anxiety is real. It affects performance, memory, and overall student well-being. While the content of an exam *should* be challenging, the *interface* should not be.

## The Role of Design in Assessment

At Brainy, we believe that good design is a pedagogical tool. Our assessment interface is built on principles of **Cognitive Load Theory**.

### 1. Minimalist Interface
During an exam, the screen is stripped of all distractions. Sidebar navigation, notifications, and irrelevant buttons fade away. The student focuses on one thing: the question.

### 2. Clear Progress Indicators
Uncertainty breeds anxiety. Our non-intrusive progress bars show students exactly where they stand without adding pressure.

### 3. Auto-Save Assurance
Nothing causes panic like the fear of losing work. Brainy saves every keystroke in real-time. We display a subtle "Saved" indicator to reassure students that their effort is secure.

## Empowering Students

By removing technical friction and visual clutter, we allow students to demonstrate their true knowledge. Technology should support the mind, not burden it.
    `,
    category: "Pedagogy & Learning",
    tags: ["Assessment", "Productivity"],
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    readingTime: 4
  },
  {
    title: "What's New in Brainy v2.0: Dark Mode & Analytics",
    slug: "whats-new-brainy-v2-dark-mode-analytics",
    excerpt: "A look at our latest release, featuring a system-wide dark mode for late-night studying and a revamped analytics engine for tutors.",
    content: `
# What's New in Brainy v2.0: Dark Mode & Analytics

We listen to our users. Our latest update, v2.0, addresses the two most requested features from our community: visual comfort and deeper data.

## Dark Mode: Built for Focus

Students and Tutors often work late into the night. The harsh glare of a white screen can lead to eye strain and fatigue.
- **System-Wide Support:** Toggle seamlessly between Light and Dark modes.
- **Contrast Optimized:** We didn't just invert colors; we calibrated the palette to ensure readability and meet WCAG accessibility standards.

## Revamped Analytics Engine

Data is only useful if it's actionable. The new Analytics dashboard provides:
- **Trend Analysis:** See how student performance changes over the semester.
- **Item Discrimination:** Identify which questions were too easy or too confusing based on aggregate pass rates.
- **Participation Metrics:** Track engagement levels to identify at-risk students before they fall behind.

## Rolling Out Now

These updates are currently rolling out to all verified institutions. Refresh your dashboard to experience the new Brainy.
    `,
    category: "Platform Updates",
    tags: ["New Feature", "Productivity", "AI"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    readingTime: 3
  },
  {
    title: "Data Sovereignty in Educational Technology",
    slug: "data-sovereignty-educational-technology",
    excerpt: "Your data belongs to you. Examining the legal and ethical importance of data ownership in the cloud era.",
    content: `
# Data Sovereignty in Educational Technology

In an era of global cloud services, the question of "where keeps my data?" is more relevant than ever. Data Sovereignty refers to the concept that data is subject to the laws of the country in which it is located.

## Why Location Matters

For educational institutions, compliance with local regulations (such as NDPR in Nigeria or GDPR in Europe) is non-negotiable. Storing student data in jurisdictions with lax privacy laws puts the institution at risk.

## The Brainy Promise

Brainy is architected with sovereignty in mind.
- **Regional Deployment:** We utilize region-specific cloud unavailability to ensure data stays closer to home.
- **Encryption at Rest:** Even if physical servers were compromised, the data remains unreadable without the encryption keys, which are managed separately.
- **Transparent Policies:** Our Terms of Service clearly define that **Institutions own their data**. We do not sell student records to advertisers.

## A Partner, Not Just a Vendor

We view our relationship with institutions as a partnership. Protecting your digital sovereignty is a core part of that commitment.
    `,
    category: "Institutional Success",
    tags: ["Security", "Integrity"],
    coverImage: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1200",
    readingTime: 6
  }
];

async function seed() {
  console.log("🌱 Seeding blog content...");

  // 1. Get or Create Author
  let author = await db.query.users.findFirst({
    where: eq(users.email, "team@brainy.os")
  });

  if (!author) {
    console.log("⚠️ 'team@brainy.os' not found. Checking for existing users...");
    const anyUser = await db.query.users.findFirst();
    
    if (anyUser) {
      author = anyUser;
      console.log(`↪️ Using existing user: ${author.name}`);
    } else {
      console.log("⚠️ No users found. Creating system author...");
      const newUserId = createId();
      await db.insert(users).values({
        id: newUserId,
        name: "Brainy Team",
        email: "team@brainy.os",
        onboardingComplete: true,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
      });
      // Re-fetch to match type
      author = await db.query.users.findFirst({
        where: eq(users.email, "team@brainy.os")
      });
    }
  }

  if (!author) {
    console.error("❌ Failed to resolve author.");
    process.exit(1);
  }

  console.log(`👤 Author resolved: ${author.name} (${author.id})`);

  // 2. Seed Categories
  console.log("📂 Seeding categories...");
  const categoryMap = new Map<string, string>();
  
  for (const cat of categories) {
    const existing = await db.query.blogCategories.findFirst({
       where: eq(blogCategories.slug, cat.slug)
    });

    let catId = existing?.id;

    if (!existing) {
      catId = createId();
      await db.insert(blogCategories).values({
        id: catId,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        updatedAt: new Date()
      });
      console.log(`   + Created category: ${cat.name}`);
    } else {
       console.log(`   = Existing category: ${cat.name}`);
    }
    
    // Store for lookup
    if (catId) categoryMap.set(cat.name, catId);
  }

  // 3. Seed Tags
  console.log("🏷️ Seeding tags...");
  const tagMap = new Map<string, string>();

  for (const tag of tags) {
    const existing = await db.query.blogTags.findFirst({
      where: eq(blogTags.slug, tag.slug)
    });

    let tagId = existing?.id;

    if (!existing) {
      tagId = createId();
      await db.insert(blogTags).values({
        id: tagId,
        name: tag.name,
        slug: tag.slug
      });
      console.log(`   + Created tag: ${tag.name}`);
    } else {
        console.log(`   = Existing tag: ${tag.name}`);
    }

    if (tagId) tagMap.set(tag.name, tagId);
  }

  // 4. Seed Posts
  console.log("📝 Seeding posts...");
  for (const post of posts) {
     const categoryId = categoryMap.get(post.category);
     if (!categoryId) {
        console.warn(`   ⚠️ Category not found for post: ${post.title}`);
        continue;
     }

     // Check if post exists
     const existing = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, post.slug)
     });

     let postId = existing?.id;

     if (!existing) {
        postId = createId();
        await db.insert(blogPosts).values({
           id: postId,
           title: post.title,
           slug: post.slug,
           excerpt: post.excerpt,
           content: post.content,
           authorId: author.id,
           categoryId: categoryId,
           coverImage: post.coverImage,
           status: "PUBLISHED",
           publishedAt: new Date(),
           views: Math.floor(Math.random() * 500) + 50,
           readingTime: post.readingTime
        });
        console.log(`   + Created post: ${post.title}`);
     } else {
        console.log(`   = Existing post: ${post.title}`);
        // Optionally update content here if we wanted to enforce sync
        await db.update(blogPosts).set({
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            categoryId: categoryId,
            readingTime: post.readingTime
        }).where(eq(blogPosts.id, existing.id));
     }

     // 5. Link Tags
     if (postId) {
        // Clear existing tags for this post to ensure clean slate
        await db.delete(blogPostTags).where(eq(blogPostTags.postId, postId));

        for (const tagName of post.tags) {
           const tagId = tagMap.get(tagName);
           if (tagId) {
              await db.insert(blogPostTags).values({
                 postId: postId,
                 tagId: tagId
              });
           }
        }
     }
  }

  console.log("✨ Blog seeding complete!");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

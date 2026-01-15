import { 
  HelpCircle, 
  GraduationCap, 
  Zap, 
  Building2, 
  Shield 
} from "lucide-react";

export const FAQ_CATEGORIES = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "students", name: "Students", icon: GraduationCap },
  { id: "tutors", name: "Tutors", icon: Zap },
  { id: "institutions", name: "Institutions", icon: Building2 },
  { id: "security", name: "Security", icon: Shield },
];

export const FAQS = [
  {
    id: "what-is-brainy",
    category: "general",
    question: "What is Brainy OS?",
    answer: "Brainy OS is a comprehensive academic assessment ecosystem designed to streamline testing, grading, and result management while ensuring the highest standards of integrity. It bridges the gap between students, educators, and institutions."
  },
  {
    id: "anti-cheating",
    category: "security",
    question: "How does Brainy prevent cheating?",
    answer: "We use a multi-layered approach including time-windowed assessments, activity pattern recognition, IP tracking, and role-based verification. Our 'Integrity Shield' logs suspicious browser activity without compromising user privacy."
  },
  {
    id: "mobile-access",
    category: "students",
    question: "Can I take a quiz on my mobile phone?",
    answer: "Yes! Brainy is fully responsive. As long as your institution allows mobile access for a specific assessment, you can take quizzes on any modern smartphone browser with a stable internet connection."
  },
  {
    id: "ai-generator",
    category: "tutors",
    question: "How do I use the AI quiz generator?",
    answer: "Our AI assistant helps you generate questions based on topics or uploaded text. Simply navigate to your dashboard, select 'Create Quiz', and choose 'AI Assist'. You can refine questions before publishing."
  },
  {
    id: "institution-verification",
    category: "institutions",
    question: "How do we verify our institution?",
    answer: "Institutions must submit official accreditation documents through the platform. Our compliance team reviews these manually to ensure that only legitimate educational bodies can use the institutional features."
  },
  {
    id: "free-plan",
    category: "general",
    question: "Is there a cost for students?",
    answer: "Students do not pay directly for Brainy. Access is provided through your institution or private tutor as part of their subscription package."
  },
  {
    id: "encryption",
    category: "security",
    question: "Is my data encrypted?",
    answer: "Absolutely. All assessment data and personal information are encrypted both in transit (TLS 1.3) and at rest (AES-256). We adhere to strict GDPR and data sovereignty protocols."
  }
];

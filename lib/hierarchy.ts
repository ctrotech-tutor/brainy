// config/hierarchy.ts
import { School, Building, Network, Users, ShieldCheck } from "lucide-react";

/**
 * Defines the structure for a single node in the hierarchy.
 * Each node has an ID, an icon, a name, a description, and optional children.
 */
export type HierarchyNode = {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  children?: HierarchyNode[];
};

/**
 * The complete data structure for the institutional hierarchy.
 * This object is the single source of truth for the interactive visual.
 */
export const hierarchyData: HierarchyNode = {
  id: "institution",
  icon: School,
  name: "Verified Institution",
  description:
    "Register and verify your institution to unlock administrative tools and ensure a trusted academic environment. This is the root of your academic ecosystem.",
  children: [
    {
      id: "faculty-science",
      icon: Building,
      name: "Faculty of Science",
      description:
        "Organize your institution into distinct faculties, each with its own set of departments, courses, and administrative oversight.",
      children: [
        {
          id: "dept-cs",
          icon: Network,
          name: "Dept. of Computer Science",
          description:
            "Create departments to manage specific academic areas, assign department heads, and structure course offerings for clarity and control.",
          children: [
            {
              id: "tutors-cs",
              icon: ShieldCheck, // Using ShieldCheck for "Official"
              name: "Official Tutors",
              description:
                "Assign verified tutors to specific courses within a department, granting them the authority to create and manage assessments.",
            },
            {
              id: "students-cs",
              icon: Users,
              name: "Enrolled Students",
              description:
                "Students enroll in courses via an official, institution-verified process, ensuring only eligible participants can access materials.",
            },
          ],
        },
        {
          id: "dept-physics",
          icon: Network,
          name: "Dept. of Physics",
          description:
            "Manage the physics department, including its curriculum, faculty assignments, and student enrollment.",
          children: [], // Can be expanded later
        },
      ],
    },
    {
      id: "faculty-arts",
      icon: Building,
      name: "Faculty of Arts",
      description:
        "Manage the arts and humanities faculty, overseeing departments like History, Literature, and Fine Arts.",
      children: [], // Can be expanded later
    },
  ],
};

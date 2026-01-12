// // app/(platform)/_actions/get-institution-for-review.ts
// "use server";

// import { db } from "@/db";
// import { institutions } from "@/db/schema";
// import { validateRequest } from "@/lib/auth";
// import { RoleGuard } from "@/lib/utils/roles";
// import { eq } from "drizzle-orm";
// import { cache } from "react";

// // Using React.cache to deduplicate requests for the same institution within a single render pass.
// // This is a performance optimization.
// export const getInstitutionForReview = cache(async (id: string) => {
//   try {
//     // 1. --- Authorization ---
//     // Use our existing server-side utilities to check for an authenticated admin user.
//     const { user } = await validateRequest();
//     if (!user) {
//       throw new Error("Unauthorized: You must be logged in.");
//     }
//     await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

//     // 2. --- Database Fetch ---
//     // Perform the detailed database query directly.
//     const institution = await db.query.institutions.findFirst({
//       where: eq(institutions.id, id),
//       with: {
//         createdBy: {
//           columns: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//         documents: {
//           columns: {
//             id: true,
//             documentType: true,
//             documentUrl: true,
//             fileName: true,
//           },
//         },
//       },
//     });

//     // 3. --- Handle Not Found ---
//     if (!institution) {
//       throw new Error("Not Found: Institution with this ID does not exist.");
//     }

//     return institution;

//   } catch (error: any) {
//     // Re-throw the error so the calling component can handle it.
//     // This is important for displaying the correct error message to the user.
//     console.error("Failed to get institution for review:", error.message);
//     throw error;
//   }
// });

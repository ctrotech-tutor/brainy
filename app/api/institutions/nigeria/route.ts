// app/api/institutions/nigeria/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises"; // Using the modern promise-based file system module
import path from "path";

// Define a clear type for the raw data from our JSON file
type NigerianUniversity = {
  name: string;
  vice_chancellor: string;
  year_of_establishment: string;
  type: "Federal" | "State" | "Private";
  url: string;
};

// --- PERFORMANCE BEST PRACTICE: In-memory caching ---
// We declare the cache variable outside the handler. This means it will persist
// across multiple API requests, avoiding repeated file reads.
let cachedUniversities: NigerianUniversity[] | null = null;

/**
 * A robust, cached function to load and parse the university data.
 * It reads the file only once and stores the result in memory.
 */
async function getUniversities(): Promise<NigerianUniversity[]> {
  // If the data is already in our cache, return it instantly.
  if (cachedUniversities) {
    return cachedUniversities;
  }

  try {
    // Construct the full path to the data file in a reliable way.
    const filePath = path.join(
      process.cwd(),
      "data",
      "nigerian-university.json"
    );

    // Read the file content asynchronously.
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Parse the JSON content.
    const data: NigerianUniversity[] = JSON.parse(fileContent);

    // Store the parsed data in our cache for future requests.
    cachedUniversities = data;

    return data;
  } catch (error) {
    // --- ROBUST ERROR HANDLING ---
    console.error("Failed to load or parse nigerian-universities.json:", error);
    // If the file is missing or corrupt, we throw an error that the handler can catch.
    throw new Error("Could not load Nigerian university data.");
  }
}

export async function GET() {
  try {
    const universities = await getUniversities();

    // --- MODERN DATA TRANSFORMATION ---
    // We can filter and format the data based on query params if needed.
    // For now, we'll format the entire list for the combobox.
    const formattedData = universities.map((uni) => ({
      label: uni.name,
      value: uni.name,
      // We include extra data that the frontend might need when a user selects an option.
      type: uni.type,
      url: uni.url,
      yearEstablished: uni.year_of_establishment,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 }
    );
  }
}

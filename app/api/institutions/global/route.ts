// app/api/institutions/global/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define a clear type for the raw data from the JSON file
type GlobalUniversity = {
  name: string;
  domains: string[];
  web_pages: string[];
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
};

// --- PERFORMANCE BEST PRACTICE: In-memory caching ---
// This will hold the entire list of world universities after the first fetch.
let cachedGlobalUniversities: GlobalUniversity[] | null = null;

const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

/**
 * A robust, cached function to load and parse the global university data.
 * It fetches the external file only once.
 */
async function getGlobalUniversities( ): Promise<GlobalUniversity[]> {
  // If the data is already in our cache, return it instantly.
  if (cachedGlobalUniversities) {
    return cachedGlobalUniversities;
  }

  try {
    console.log("Fetching global universities for the first time...");
    const response = await axios.get<GlobalUniversity[]>(GITHUB_RAW_URL);
    
    // Validate that we received an array of data
    if (!Array.isArray(response.data)) {
      throw new Error("Fetched data is not in the expected format (array).");
    }

    // Store the data in our cache for all future requests.
    cachedGlobalUniversities = response.data;
    console.log(`Successfully cached ${cachedGlobalUniversities.length} global universities.`);

    return cachedGlobalUniversities;
  } catch (error) {
    // --- ROBUST ERROR HANDLING ---
    console.error("Failed to fetch or cache global universities:", error);
    throw new Error("Could not load global university data.");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    if (!country) {
      return NextResponse.json(
        { error: "The 'country' query parameter is required." },
        { status: 400 }
      );
    }

    const allUniversities = await getGlobalUniversities();

    // --- EFFICIENT SERVER-SIDE FILTERING ---
    // Filter the massive list on the server based on the provided country.
    const filteredUniversities = allUniversities.filter(
      (uni) => uni.country.toLowerCase() === country.toLowerCase()
    );

    // --- MODERN DATA TRANSFORMATION ---
    const formattedData = filteredUniversities.map(uni => ({
      label: uni.name,
      value: uni.name,
      // Include extra data the frontend will need
      domain: uni.domains[0], // Take the first domain as the primary
      website: uni.web_pages[0], // Take the first web page
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

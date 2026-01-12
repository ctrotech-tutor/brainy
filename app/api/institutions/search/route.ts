// app/api/institutions/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Define the shape of the data we expect
type GlobalUniversity = {
  name: string;
  domains: string[];
  web_pages: string[];
  country: string;
};

// --- Caching Logic ---
let cachedGlobalUniversities: GlobalUniversity[] | null = null;
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

async function getGlobalUniversities( ): Promise<GlobalUniversity[]> {
  if (cachedGlobalUniversities) return cachedGlobalUniversities;
  try {
    const response = await axios.get<GlobalUniversity[]>(GITHUB_RAW_URL);
    cachedGlobalUniversities = response.data;
    return cachedGlobalUniversities;
  } catch (error) {
    console.error("Failed to fetch or cache global universities:", error);
    throw new Error("Could not load global university data.");
  }
}

// --- The Main Handler ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const query = searchParams.get("query");

    if (!country || !query || query.length < 2) {
      return NextResponse.json([]);
    }

    const universities = await getGlobalUniversities();
    const lowerCaseQuery = query.toLowerCase();

    const results = universities
      .filter(uni => 
        uni.country.toLowerCase() === country.toLowerCase() && 
        uni.name.toLowerCase().includes(lowerCaseQuery)
      )
      .map(uni => ({
        // This is the format our Combobox expects
        label: uni.name,
        value: uni.name,
        // Extra data to populate the form
        domain: uni.domains[0],
        website: uni.web_pages[0],
      }));

    return NextResponse.json(results.slice(0, 50));

  } catch (error) {
    console.error("Institution search error:", error);
    return NextResponse.json({ error: "Failed to search for institutions." }, { status: 500 });
  }
}

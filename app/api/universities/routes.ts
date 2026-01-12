import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import path from 'path';
import { promises as fs } from 'fs';
import { University } from '@/lib/types';

// The GET function now accepts a `request` object
export async function GET(request: NextRequest) {
  // --- Step 1: Locate and Read the JSON file (same as before) ---
  const jsonDirectory = path.join(process.cwd(), 'app', 'data');
  const filePath = path.join(jsonDirectory, 'nigerian-university.json');
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    let universities: University[] = JSON.parse(fileContents); // Use 'let' to allow modification

    // --- Step 2: Get query parameters from the URL ---
    const searchParams = request.nextUrl.searchParams;
    const universityType = searchParams.get('type'); // e.g., 'federal', 'state', 'private'
    const searchQuery = searchParams.get('search'); // e.g., 'Lagos', 'Bauchi'

    let message = "Successfully fetched universities.";

    // --- Step 3: Apply filters and searches ---

    // A. Filter by university type
    if (universityType) {
      const typeLower = universityType.toLowerCase();
      universities = universities.filter(uni => uni.type.toLowerCase() === typeLower);
      message = `Successfully fetched ${universityType} universities.`;

      // Special rule: Limit private universities to 20
      if (typeLower === 'private' && universities.length > 20) {
        universities = universities.slice(0, 20);
        message += " Results limited to the first 20.";
      }
    }

    // B. Filter by search query (checks the university name)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      universities = universities.filter(uni => 
        uni.name.toLowerCase().includes(searchLower)
      );
      // Update message only if it hasn't been set by the 'type' filter
      if (!universityType) {
        message = `Successfully fetched universities matching "${searchQuery}".`;
      }
    }

    // --- Step 4: Send the successful response ---
    return NextResponse.json({
      error: false,
      message: message,
      data: universities,
    });

  } catch (error) {
    // --- Error handling (same as before) ---
    console.error("Failed to read or parse university data:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Unable to fetch data. Please try again later.",
        data: null,
      },
      { status: 500 }
    );
  }
}

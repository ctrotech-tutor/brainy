import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { University } from '@/lib/types';
import { generateAbbreviation } from '@/lib/utils'; // Import our new utility

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // The `slug` is the dynamic part of the URL (e.g., "abu" or "Ahmadu Bello University...")
  const { slug } = await params;

  // --- Step 1: Read and Parse Data (same pattern as before) ---
  const jsonDirectory = path.join(process.cwd(), 'app', 'data');
  const filePath = path.join(jsonDirectory, 'nigerian-university.json');

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const universities: University[] = JSON.parse(fileContents);

    // --- Step 2: Find the matching university ---
    const target = slug.toLowerCase();
    const university = universities.find(uni => {
      const nameLower = uni.name.toLowerCase();
      const abbr = generateAbbreviation(uni.name); // No need to lowercase, it's already uppercase

      // Check for match by full name OR by abbreviation
      return nameLower === target || abbr.toLowerCase() === target;
    });

    // --- Step 3: Handle the response ---
    if (university) {
      // If a university was found, return it
      return NextResponse.json({
        error: false,
        message: "Successfully fetched university details.",
        data: university,
      });
    } else {
      // If no university was found, return a 404 Not Found error
      return NextResponse.json(
        {
          error: true,
          message: `University with name or abbreviation "${slug}" not found.`,
          data: null,
        },
        { status: 404 }
      );
    }

  } catch (error) {
    // --- Generic error handling ---
    console.error("Failed to process request:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Unable to process request. Please try again later.",
        data: null,
      },
      { status: 500 }
    );
  }
}

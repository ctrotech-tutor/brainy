// app/api/countries/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// Define a type for the country data we care about
type Country = {
  name: {
    common: string;
  };
  cca2: string; // e.g., "NG", "US"
};

export async function GET() {
  try {
    // Fetch data from the Rest Countries API
    const response = await axios.get<Country[]>("https://restcountries.com/v3.1/all?fields=name,cca2" );

    // Format the data into a simple { value, label } structure for our UI components
    const formattedCountries = response.data
      .map(country => ({
        label: country.name.common,
        value: country.name.common, // Using the common name as the value
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically for better UX

    return NextResponse.json(formattedCountries);

  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching country data." },
      { status: 500 }
    );
  }
}

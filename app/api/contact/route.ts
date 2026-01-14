import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    // Validate basic fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process the contact request
    // In a production environment, you would send an email using Resend, SendGrid, etc.
    // or store the inquiry in a database like Supabase or MongoDB.
    
    console.log("Contact Form Submission:", {
      name,
      email,
      company: company || "Not specified",
      message,
      receivedAt: new Date().toISOString(),
    });

    // Mock delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(
      { message: "Inquiry received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

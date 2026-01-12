// app/api/polytechnics/route.ts
import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function GET() {
  try {
    // 1️⃣ GET the page to get CSRF token
    const getRes = await fetch(
      "https://www.digitalnbte.nbte.gov.ng/Public/PUCPolytechnics",
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        },
      }
    );

    const html = await getRes.text();

    // 2️⃣ Parse CSRF token
    const dom = new JSDOM(html);
    const tokenInput = dom.window.document.querySelector<HTMLInputElement>(
      'input[name="_token"]'
    );

    if (!tokenInput) throw new Error("CSRF token not found");

    const _token = tokenInput.value;

    // 3️⃣ POST request to fetch polytechnics table
    const formData = new URLSearchParams();
    formData.append("_token", _token);
    formData.append("CategoryCode", "PAll"); // All Polytechnics

    const postRes = await fetch(
      "https://www.digitalnbte.nbte.gov.ng/Public/PUCProcess",
      {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
          "x-csrf-token": _token,
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );

    const postHtml = await postRes.text();

    // 4️⃣ Parse polytechnic table
    const postDom = new JSDOM(postHtml);
    const rows = Array.from(
      postDom.window.document.querySelectorAll("table tbody tr")
    );

    const polytechnics = rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        sNo: cells[0]?.textContent?.trim(),
        name: cells[1]?.textContent?.trim(),
        category: cells[2]?.textContent?.trim(),
        ownership: cells[3]?.textContent?.trim(),
        state: cells[4]?.textContent?.trim(),
      };
    });

    return NextResponse.json({ polytechnics, csrfToken: _token });

  } catch (err: any) {
    console.error("Failed to fetch polytechnics:", err);
    return NextResponse.json({ polytechnics: [], error: err.message });
  }
}

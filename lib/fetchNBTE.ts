// lib/fetchNBTE.ts
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function fetchNBTEPolytechnics(category = "PAll") {
  // 1️⃣ Post request to NBTE form
  const formData = new URLSearchParams();
  formData.append("CategoryCode", category);

  const res = await fetch("https://www.digitalnbte.nbte.gov.ng/Public/PUCProcess", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const html = await res.text();

  // 2️⃣ Parse HTML table
  const dom = new JSDOM(html);
  const rows = Array.from(dom.window.document.querySelectorAll("#example1 tbody tr"));

  const polytechnics = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      serial: cells[0]?.textContent?.trim() || "",
      name: cells[1]?.textContent?.trim() || "",
      category: cells[2]?.textContent?.trim() || "",
      ownership: cells[3]?.textContent?.trim() || "",
      state: cells[4]?.textContent?.trim() || "",
      nbteId: (cells[5]?.querySelector("button") as HTMLButtonElement)?.value || "",
    };
  });

  return polytechnics;
}

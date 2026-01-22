import fs from "fs/promises";
import path from "path";

export type NigerianUniversity = {
    name: string;
    vice_chancellor: string;
    year_of_establishment: string;
    type: "Federal" | "State" | "Private";
    url: string;
};

// Simple in-memory cache
let cachedUniversities: NigerianUniversity[] | null = null;

export async function getNigerianUniversities(): Promise<NigerianUniversity[]> {
    if (cachedUniversities) {
        return cachedUniversities;
    }

    try {
        const filePath = path.join(process.cwd(), "data", "nigerian-university.json");
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data: NigerianUniversity[] = JSON.parse(fileContent);

        cachedUniversities = data;
        return data;
    } catch (error) {
        console.error("Failed to load Nigerian university data:", error);
        return [];
    }
}

export async function findNigerianInstitution(name: string): Promise<NigerianUniversity | undefined> {
    const universities = await getNigerianUniversities();
    return universities.find((uni) => uni.name.toLowerCase() === name.toLowerCase());
}

export async function isKnownNigerianInstitution(name: string): Promise<boolean> {
    const result = await findNigerianInstitution(name);
    return !!result;
}

import fs from "fs";
import path from "path";

const DOCS_PATH = path.join(process.cwd(), "content/docs");

export interface DocMetadata {
  title: string;
  slug: string;
}

export interface DocContent extends DocMetadata {
  content: string;
}

export function getDocBySlug(slug: string[]): DocContent | null {
  const fullPath = path.join(DOCS_PATH, ...slug) + ".md";
  
  try {
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    
    // Simple title extraction if not using frontmatter
    const titleMatch = fileContents.match(/^#\s+(.+)/);
    const title = titleMatch ? titleMatch[1] : slug[slug.length - 1];
    
    return {
      slug: slug.join("/"),
      title,
      content: fileContents,
    };
  } catch (error) {
    return null;
  }
}

export function getAllDocs(dirPath: string = DOCS_PATH, baseSlug: string[] = []): DocMetadata[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  return entries.flatMap((entry) => {
    const relativePath = [...baseSlug, entry.name.replace(".md", "")];
    
    if (entry.isDirectory()) {
      return getAllDocs(path.join(dirPath, entry.name), relativePath);
    }
    
    if (entry.name.endsWith(".md")) {
      const fileContents = fs.readFileSync(path.join(dirPath, entry.name), "utf8");
      const titleMatch = fileContents.match(/^#\s+(.+)/);
      const title = titleMatch ? titleMatch[1] : entry.name.replace(".md", "");
      
      return [{
        title,
        slug: relativePath.join("/"),
      }];
    }
    
    return [];
  });
}

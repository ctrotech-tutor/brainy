// lib/seo.ts
import { Metadata } from "next";

export const siteConfig = {
  name: "Brainy",
  description: "The Operating System for Modern Education and Academic Integrity.",
  url: "https://brainy.os",
  ogImage: "https://brainy.os/og.jpg",
  links: {
    twitter: "https://twitter.com/brainy_os",
    github: "https://github.com/ctrotech-tutor/brainy",
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/brainy_favicon.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@brainy_os",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Brainy",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "100"
    }
  };
}

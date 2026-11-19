import type { MetadataRoute } from "next";
import { DOCS } from "@/lib/docs";
import { DOCS_URL } from "@/lib/site";

// Built once, as out/sitemap.xml: pley.media/docs/sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${DOCS_URL}/`, changeFrequency: "weekly", priority: 0.8 },
    ...DOCS.map((doc) => ({ url: `${DOCS_URL}/${doc.slug}/`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}

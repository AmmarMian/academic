// src/pages/api/publications.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(
      "https://api.archives-ouvertes.fr/search/?q=ammar+mian&fl=uri_s,authFullName_s,title_s,docType_s,producedDate_s,journalTitle_s,conferenceTitle_s,label_bibtex,citationFull_s&sort=producedDate_s%20desc&wt=json"
    );
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 week with stale-while-revalidate support
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch publications" }),
      { status: 500 }
    );
  }
};


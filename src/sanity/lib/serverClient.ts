import { createClient } from "next-sanity";

/**
 * Write-enabled Sanity client — server-only.
 * Requires SANITY_API_TOKEN with Editor (write) permission in Vercel.
 * Never import this from a client component.
 */
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

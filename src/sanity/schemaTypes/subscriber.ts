import { defineField, defineType } from "sanity";

/**
 * A newsletter sign-up (from tmstry.com or the BROADCAST site, through /api/subscribe). Stored under
 * a private path (subscriber.<hash of the address>), so the public dataset never shows it: only the
 * Studio, signed in, sees the list. One per address. Delete one to take someone off the list (it can
 * only be deleted there: a duplicate would be a copy on a public path; see config.ts).
 */
export const subscriber = defineType({
  name: "subscriber",
  title: "Newsletter sign-up",
  type: "document",
  fields: [
    defineField({ name: "email", title: "E-mail", type: "string", readOnly: true }),
    defineField({ name: "source", title: "Signed up on", type: "string", readOnly: true }),
    defineField({ name: "createdAt", title: "Signed up at", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "email", source: "source", at: "createdAt" },
    prepare({ title, source, at }) {
      return { title: title, subtitle: [source, at ? String(at).slice(0, 10) : null].filter(Boolean).join(" · ") };
    },
  },
});

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// The BROADCAST site's facts are one fixed document, at the top of the list; newsletter sign-ups come
// in through /api/subscribe only, and can only be deleted here (a duplicate would land on a public path).
const SINGLE = "broadcastSite";

export default defineConfig({
  name: "default",
  title: "TMSTRY",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("BROADCAST site").id(SINGLE).child(S.document().schemaType(SINGLE).documentId(SINGLE)),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== SINGLE),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== SINGLE && t.templateId !== "subscriber"),
    actions: (prev, ctx) =>
      ctx.schemaType === "subscriber" ? prev.filter((a) => a.action === "delete")
      : ctx.schemaType === SINGLE ? prev.filter((a) => a.action === "publish" || a.action === "discardChanges" || a.action === "restore")
      : prev,
  },
});

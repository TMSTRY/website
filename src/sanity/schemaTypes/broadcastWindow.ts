import { defineField, defineType } from "sanity";

/**
 * "Say it anyway" on the BROADCAST site: at the end of the walk, under "I hear you.", a visitor writes
 * one line and sends it ("Over."), and it becomes a lit window in the town at nightfall (still S135),
 * for everyone (Tim: shown at once). Tim reads them here, answers one (his answer shows on the
 * writer's own window: "Seen", and his line), or hides one. They come in through /api/say only.
 */
export const broadcastWindow = defineType({
  name: "broadcastWindow",
  title: "BROADCAST windows (Say it anyway)",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Their line", type: "string", readOnly: true }),
    defineField({ name: "createdAt", title: "Sent at", type: "datetime", readOnly: true }),
    defineField({
      name: "reply",
      title: "Your answer",
      type: "string",
      description: "Optional. Shown on their window, under 'Seen', when they come back. Short, lowercase reads best.",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      description: "Tick to take this window off the site.",
      initialValue: false,
    }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "text", reply: "reply", hidden: "hidden" },
    prepare({ title, reply, hidden }) {
      return { title: `${hidden ? "🚫 " : ""}${title ?? ""}`, subtitle: reply ? `answered: ${reply}` : "not answered" };
    },
  },
});

import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
      readOnly: true,
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "newsPost" }],
      readOnly: true,
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      description: "Vink aan om de reactie zichtbaar te maken op de site.",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "message", approved: "approved" },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${approved ? "✓" : "⏳"} ${title ?? "Anoniem"}`,
        subtitle,
      };
    },
  },
});

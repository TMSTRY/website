import { defineField, defineType } from "sanity";

export const signalLog = defineType({
  name: "signalLog",
  title: "Signal Log (Signal Room lore)",
  type: "document",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Side-monitor log", value: "log" },
          { title: "Hidden message (corrupted channel)", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "log",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Untick to hide this from the Signal Room.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "kind", active: "active" },
    prepare({ title, subtitle, active }) {
      return { title: `${active === false ? "🚫 " : ""}${title}`, subtitle };
    },
  },
});

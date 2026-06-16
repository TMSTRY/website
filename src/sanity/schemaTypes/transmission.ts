import { defineField, defineType } from "sanity";

export const CHANNELS = [
  { value: "CH01", title: "CH01 — Music Videos" },
  { value: "CH02", title: "CH02 — Teasers" },
  { value: "CH03", title: "CH03 — Archive Footage" },
  { value: "CH04", title: "CH04 — Behind The Scenes" },
  { value: "CH05", title: "CH05 — Corrupted Signal" },
];

export const transmission = defineType({
  name: "transmission",
  title: "Transmission (Signal Room)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      options: { list: CHANNELS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "The video this snippet is taken from. Leave blank if you upload an MP4 below.",
    }),
    defineField({
      name: "videoFile",
      title: "MP4 clip (optional)",
      type: "file",
      options: { accept: "video/mp4" },
      description: "Upload a short clip for exclusive/raw footage instead of YouTube.",
    }),
    defineField({
      name: "mp4Url",
      title: "External MP4 URL (optional)",
      type: "url",
      description: "Or link to an external .mp4 file.",
    }),
    defineField({
      name: "start",
      title: "Start (seconds)",
      type: "number",
      description: "Where the snippet starts.",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      description: "How long the snippet plays before switching. Leave blank for ~22s.",
      validation: (Rule) => Rule.min(2),
    }),
    defineField({
      name: "corrupted",
      title: "Corrupted",
      type: "boolean",
      description: "Heavier glitch treatment (use for CH05 / hidden signals).",
      initialValue: false,
    }),
    defineField({
      name: "note",
      title: "Signal note (optional)",
      type: "string",
      description: "Faint cryptic caption shown over the broadcast.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "channel" },
  },
});

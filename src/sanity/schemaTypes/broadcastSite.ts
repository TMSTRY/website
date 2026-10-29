import { defineField, defineType } from "sanity";

/**
 * The facts of the BROADCAST site (TMSTRY/broadcast, broadcast-flame.vercel.app) that Tim fills in
 * himself: once the video is public, its link; the release date; the song's own streaming links.
 * One document only, with the fixed id "broadcastSite" (config.ts lists it on its own). That site
 * reads it (public, no token) every minute; whatever is empty here stays as in its own code ("soon"
 * on the site until then).
 */
const youtube = (v: unknown) =>
  !v || /^(https?:\/\/)?(www\.|m\.|music\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(String(v)) || "A YouTube link, like https://youtu.be/xxxxxxxxxxx";

export const broadcastSite = defineType({
  name: "broadcastSite",
  title: "BROADCAST site",
  type: "document",
  fields: [
    defineField({
      name: "videoUrl",
      title: "Music video (YouTube link)",
      type: "url",
      description: "Once the official video is public. The site's Video page then plays it.",
      validation: (Rule) => Rule.custom(youtube),
    }),
    defineField({
      name: "makingOfUrl",
      title: "Making-of (YouTube link)",
      type: "url",
      validation: (Rule) => Rule.custom(youtube),
    }),
    defineField({
      name: "releaseDate",
      title: "Release date of BROADCAST",
      type: "date",
      options: { dateFormat: "DD-MM-YYYY" },
    }),
    defineField({ name: "spotify", title: "BROADCAST on Spotify", type: "url" }),
    defineField({ name: "appleMusic", title: "BROADCAST on Apple Music", type: "url" }),
    defineField({ name: "youtube", title: "BROADCAST on YouTube (or YouTube Music)", type: "url" }),
  ],
  preview: {
    select: { date: "releaseDate" },
    prepare({ date }) {
      return { title: "BROADCAST site", subtitle: date ? `Out ${date}` : "Release date not set yet" };
    },
  },
});

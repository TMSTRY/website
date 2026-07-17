import { groq } from "next-sanity";

const postFields = `
  _id,
  title,
  "slug": slug.current,
  tag,
  date,
  body,
  image,
  youtubeUrl,
  "likes": coalesce(likes, 0),
`;

// All published posts (used on the /news archive)
export const newPostsQuery = groq`
  *[_type == "newsPost" && published != false] | order(date desc, _createdAt desc) {
    ${postFields}
  }
`;

// Latest 6 published posts (used on the homepage)
export const latestPostsQuery = groq`
  *[_type == "newsPost" && published != false] | order(date desc, _createdAt desc) [0...6] {
    ${postFields}
  }
`;

// Total number of published posts (to decide whether to show "View all")
export const postsCountQuery = groq`count(*[_type == "newsPost" && published != false])`;

// Latest post metadata only (footer "last transmission" line)
export const latestPostMetaQuery = groq`
  *[_type == "newsPost" && published != false] | order(date desc, _createdAt desc) [0] {
    title, date, "slug": slug.current
  }
`;

// A single published post by slug (for /news/[slug])
export const postBySlugQuery = groq`
  *[_type == "newsPost" && published != false && slug.current == $slug][0] {
    ${postFields}
  }
`;

// Signal Room lore (side-monitor logs + hidden corrupted messages)
export const loreQuery = groq`
  *[_type == "signalLog" && active != false] | order(coalesce(order, 999) asc, _createdAt asc){
    text, kind
  }
`;

// All published slugs (for generateStaticParams)
export const postSlugsQuery = groq`
  *[_type == "newsPost" && published != false && defined(slug.current)]{ "slug": slug.current }
`;

// Signal Room transmissions (snippets per channel)
export const transmissionsQuery = groq`
  *[_type == "transmission" && (defined(youtubeUrl) || defined(mp4Url) || defined(videoFile.asset))]
    | order(channel asc, coalesce(order, 999) asc, _createdAt asc){
    _id, title, channel, youtubeUrl,
    "mp4": coalesce(mp4Url, videoFile.asset->url),
    "start": coalesce(start, 0), duration, corrupted, note
  }
`;

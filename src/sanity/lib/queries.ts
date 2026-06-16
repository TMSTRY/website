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

// A single published post by slug (for /news/[slug])
export const postBySlugQuery = groq`
  *[_type == "newsPost" && published != false && slug.current == $slug][0] {
    ${postFields}
  }
`;

// All published slugs (for generateStaticParams)
export const postSlugsQuery = groq`
  *[_type == "newsPost" && published != false && defined(slug.current)]{ "slug": slug.current }
`;

import { groq } from "next-sanity";

export const newPostsQuery = groq`
  *[_type == "newsPost" && published != false] | order(date desc) {
    _id,
    title,
    tag,
    date,
    body,
    image,
    youtubeUrl,
  }
`;

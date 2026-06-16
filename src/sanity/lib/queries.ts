import { groq } from "next-sanity";

export const newPostsQuery = groq`
  *[_type == "newsPost" && published != false] | order(date desc, _createdAt desc) {
    _id,
    title,
    tag,
    date,
    body,
    image,
    youtubeUrl,
    "likes": coalesce(likes, 0),
  }
`;

import { groq } from "next-sanity";

export const newPostsQuery = groq`
  *[_type == "newsPost" && published == true] | order(date desc) {
    _id,
    title,
    tag,
    date,
    body,
    image,
  }
`;

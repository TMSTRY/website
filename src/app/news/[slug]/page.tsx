import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import PostDetail from "@/components/PostDetail";
import { type Post, bodyToPlainText } from "@/components/newsTypes";

async function getPost(slug: string): Promise<Post | null> {
  return client
    .fetch<Post | null>(postBySlugQuery, { slug }, { next: { tags: ["newsPost"] } })
    .catch(() => null);
}

export async function generateStaticParams() {
  const slugs = await client
    .fetch<{ slug: string }[]>(postSlugsQuery)
    .catch(() => []);
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "News — TMSTRY" };

  const description = bodyToPlainText(post.body).replace(/\s+/g, " ").trim().slice(0, 160);
  const image = post.image?.asset
    ? urlFor(post.image).width(1200).height(630).fit("crop").url()
    : "/og.png";
  const url = `https://tmstry.com/news/${slug}`;

  return {
    title: `${post.title} — TMSTRY`,
    description,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="relative min-h-screen bg-obsidian px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="font-display font-bold text-soft-white tracking-widest text-sm"
            style={{ letterSpacing: "0.35em" }}
          >
            TMSTRY
          </Link>
          <Link
            href="/news"
            className="text-silver/50 hover:text-soft-white text-[10px] tracking-widest uppercase transition-colors duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            ← All news
          </Link>
        </div>

        {/* Post card */}
        <article className="relative border border-white/[0.08] bg-charcoal/40 p-8 md:p-10">
          <PostDetail post={post} />
        </article>
      </div>
    </main>
  );
}

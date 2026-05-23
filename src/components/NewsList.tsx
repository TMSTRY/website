"use client";

import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";

type Post = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  body: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function NewsList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <p
        className="text-silver/20 text-[10px] tracking-widest uppercase py-12"
        style={{ letterSpacing: "0.25em" }}
      >
        No posts yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-px">
      {posts.map((post, i) => (
        <FadeInSection key={post._id} delay={i * 0.08}>
          <motion.article
            className="group relative border-t border-white/[0.06] py-8 md:py-10 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12 cursor-default"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hover accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-glow-blue scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

            {/* Date & tag */}
            <div className="flex md:flex-col gap-3 md:gap-2 pt-1">
              <span
                className="text-[9px] tracking-widest uppercase"
                style={{ letterSpacing: "0.3em", color: "rgba(79,195,247,0.6)" }}
              >
                {post.tag}
              </span>
              <span
                className="text-[10px] tracking-widest text-silver/30 uppercase"
                style={{ letterSpacing: "0.2em" }}
              >
                {formatDate(post.date)}
              </span>
            </div>

            {/* Content */}
            <div>
              <h3
                className="font-display font-semibold text-soft-white mb-3 group-hover:text-white transition-colors duration-300"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.02em" }}
              >
                {post.title}
              </h3>
              <p className="text-silver/50 text-sm leading-relaxed" style={{ letterSpacing: "0.02em" }}>
                {post.body}
              </p>
            </div>
          </motion.article>
        </FadeInSection>
      ))}

      {/* Bottom border */}
      <div className="border-t border-white/[0.06]" />
    </div>
  );
}

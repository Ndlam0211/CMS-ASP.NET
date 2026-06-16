import React from "react";
import { PostCard } from "../../components/blog/PostCard";

export const JournalSection = ({ posts, loading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center sm:text-left mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider">
          The ATELIER Journal
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Weekly chronicles of styling philosophy, textile science, and
          architecture.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse flex flex-col gap-3">
              <div className="aspect-video bg-neutral-200" />
              <div className="h-4 bg-neutral-200 rounded-sm w-1/4" />
              <div className="h-6 bg-neutral-200 rounded-sm w-3/4" />
              <div className="h-10 bg-neutral-200 rounded-sm w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

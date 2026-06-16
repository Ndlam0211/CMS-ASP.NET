import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import {IMAGE_BASE_URL}  from "../../api/axiosClient";

export const PostCard = ({ post }) => {
  if (!post) return null;

  return (
    <article className="group flex flex-col bg-white overflow-hidden border border-neutral-100 hover:shadow-md transition-all duration-300">
      <Link
        to={`/blog/${post.id}`}
        className="block aspect-3/2 bg-neutral-50 overflow-hidden relative"
      >
        <img
          src={IMAGE_BASE_URL+post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="p-5 flex flex-col gap-2.5 flex-grow">
        <div className="flex gap-2 items-center flex-wrap text-[10px] font-mono text-neutral-400">
          <Clock size={11} />
          <time>
            {new Date(post.createdDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.categoryName && (
            <>
              <span>•</span>
              <span className="uppercase text-neutral-600 font-bold tracking-wider">
                {post.categoryName}
              </span>
            </>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors line-clamp-1">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-2">
          {post.content}
        </p>

        <Link
          to={`/blog/${post.id}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline"
        >
          Read Journal <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
};

export default PostCard;

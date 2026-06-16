import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Share2, CircleAlert } from "lucide-react";
import { postService } from "../../services/postService";

export const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const response = await postService.getPostById(id);
        if (!response) throw new Error("Article entry not found");
        setPost(response);
      } catch (err) {
        setError(err.message || "Failed to load journal entry");
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger on mount/content update
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [post]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-4 bg-neutral-200 rounded-sm w-20 mb-6" />
        <div className="h-10 bg-neutral-200 rounded-sm w-full mb-4" />
        <div className="h-4 bg-neutral-200 rounded-sm w-1/3 mb-10" />
        <div className="aspect-video bg-neutral-200 mb-10" />
        <div className="flex flex-col gap-3">
          <div className="h-4 bg-neutral-200 rounded-sm w-full" />
          <div className="h-4 bg-neutral-200 rounded-sm w-full" />
          <div className="h-4 bg-neutral-200 rounded-sm w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl border border-dashed border-neutral-250 mx-auto px-4 py-16 text-center mt-12 rounded-none">
        <CircleAlert className="w-12 h-12 text-neutral-400 mx-auto mb-4 stroke-1" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Unable To Retrieve Diary
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
          The requested chronicle is missing or currently being drafted. Return to the list to browse standard archives.
        </p>
        <Link to="/blog" className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
          Browse Journal List
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-100 z-[9999]">
        <div 
          className="h-full bg-neutral-900 transition-all duration-75 ease"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Back Anchor */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-neutral-950 hover:underline mb-8"
        >
          <ArrowLeft size={12} /> Back to Journal Entries
        </Link>

        {/* Headings */}
        <header className="mb-8">
          <time className="text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase block mb-3">
            ATELIER CRITICAL STUDY • {post.categoryName} • {new Date(post.createdDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </time>
          <h1 className="text-2xl sm:text-4.5xl font-black text-neutral-950 uppercase tracking-wide leading-tight mb-4">
            {post.title}
          </h1>
          
          {/* Author / Date Info */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-mono text-neutral-400 border-t border-b border-neutral-100 py-3 mt-6">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>
                {new Date(post.createdDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>5 Min Read Study</span>
            </div>
            <div className="ml-auto flex items-center gap-2 cursor-pointer hover:text-neutral-900 transition-colors">
              <Share2 size={13} />
              <span>Share Chronicle</span>
            </div>
          </div>
        </header>

        {/* Hero Visual */}
        <div className="aspect-21/9 bg-neutral-50 border border-neutral-100 overflow-hidden mb-10">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Markdown mock layout */}
        <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed text-sm sm:text-base space-y-6">
          <p className="font-bold text-neutral-900 text-base sm:text-lg border-l-4 border-neutral-900 pl-4 py-1">
            {post.content.split(".")[0]}.
          </p>
          <p>
            {post.content}
          </p>
          <p>
            Furthermore, our textile archives indicate that using Supima cotton results in garments that maintain color fidelity up to 3x longer than traditional carded cotton weaves. When combined with customized natural indigo bath details, we accomplish a deep shade consistency that resists fading while promoting water recycling values in global supply channels.
          </p>
          <p className="bg-neutral-50/50 p-6 border border-neutral-100 font-mono text-xs text-neutral-500 leading-relaxed my-8">
            "Architecture in apparel begins with the single fiber. If the structural integrity of the yarn is compromised, no amount of fine-tailored stitching can save the silhouette over time." <br />
            <span className="block mt-2 font-bold text-neutral-800 uppercase text-[10px]">— Head Designer, Atelier Kyoto Studio</span>
          </p>
          <p>
            To conclude, minimalist dressing isn't merely about owning fewer pieces. It's about maintaining a highly calculated inventory of adaptable items that complement one another seamlessly. Investing in durable garments remains the strongest contribution toward mindful fashion consumption and smart spatial living.
          </p>
        </div>

      </article>
    </>
  );
};

export default BlogDetailPage;

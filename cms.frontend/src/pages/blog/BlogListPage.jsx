import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { postService } from "../../services/postService";
import { PostCard } from "../../components/blog/PostCard";

export const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          postService.getPosts(),
          postService.getBlogCategories()
        ]);
        setPosts(postsRes);
        setCategories(categoriesRes);
      } catch (err) {
        setError("Unable to retrieve articles or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.categoryName === selectedCategory);

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="border-b border-neutral-100 pb-6 mb-8 text-center sm:text-left">
        <span className="text-xs font-bold text-neutral-400 font-mono block mb-1">
          Editorial Curation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-widest">
          The ATELIER Journal
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
          Weekly thoughts on textile engineering, minimal coordinates, capsular wardrobe physics, and slow craft structures.
        </p>
      </div>

      {/* Category Navigation Filter */}
      {!error && !loading && (
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 border ${
              selectedCategory === "All"
                ? "bg-neutral-900 border-neutral-900 text-white"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            }`}
          >
            All Entries ({posts.length})
          </button>
          
          {categories.map((category) => {
            const count = posts.filter(p => p.categoryName === category.name).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 border ${
                  selectedCategory === category.name
                    ? "bg-neutral-900 border-neutral-900 text-white"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Active Category Meta Description */}
      {selectedCategory !== "All" && (
        <div className="p-4 bg-neutral-50 border border-neutral-150 mb-8 max-w-2xl">
          <p className="text-xs text-neutral-500 font-mono">
            Currently displaying articles under <strong className="text-neutral-800">{selectedCategory}</strong>:{" "}
            {categories.find((c) => c.name === selectedCategory)?.description || "Curated journals focusing on quality craftsmanship."}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse flex flex-col gap-3">
              <div className="aspect-3/2 bg-neutral-200" />
              <div className="h-4 bg-neutral-200 rounded-sm w-1/4" />
              <div className="h-6 bg-neutral-200 rounded-sm w-3/4" />
              <div className="h-10 bg-neutral-200 rounded-sm w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto text-center py-10">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <BookOpen className="text-neutral-300 w-12 h-12 mb-4 mx-auto stroke-1" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Không có dữ liệu để hiển thị
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Hiện không có bài viết nào phù hợp với danh mục này. Vui lòng quay lại sau.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-100 pt-8 mt-4 gap-4">
              <span className="text-xs font-mono text-neutral-400 font-medium">
                Trang <strong className="text-neutral-900 font-bold">{currentPage}</strong> / <strong className="text-neutral-900 font-bold">{totalPages}</strong> (Tổng cộng {totalPosts} bài viết)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    currentPage === 1
                      ? "bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  // Handle hiding too many page numbers if totalPages > 5
                  if (totalPages > 5 && Math.abs(currentPage - pageNumber) > 1 && pageNumber !== 1 && pageNumber !== totalPages) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return <span key={`dots-${pageNumber}`} className="text-neutral-300 font-mono px-1">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 border text-xs font-mono font-bold transition-all duration-300 ${
                        currentPage === pageNumber
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default BlogListPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesThunk } from "../../store/slices/categorySlice";
import {
  fetchLatestProducts,
  fetchFeaturedProducts,
} from "../../store/slices/productSlice";
import { postService } from "../../services/postService";
import { HeroBanner } from "./HeroBanner";
import { CategoriesSection } from "./CategoriesSection";
import { LatestArrivalsSection } from "./LatestArrivalsSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { ValueSignalsSection } from "./ValueSignalsSection";
import { JournalSection } from "./JournalSection";

export const HomePage = () => {
  const dispatch = useDispatch();

  const { latestProducts, latestProductsLoading, latestProductsError } =
    useSelector((state) => state.products);
  const { featuredProducts, featuredProductsLoading, featuredProductsError } =
    useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [latestPosts, setLatestPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Load Latest and Featured products, categories, and Latest articles
  useEffect(() => {
    dispatch(fetchLatestProducts());
    dispatch(fetchFeaturedProducts());
    dispatch(getCategoriesThunk());

    const fetchLatestPosts = async () => {
      setPostsLoading(true);
      try {
        const posts = await postService.getPosts();
        // Take latest 3 posts
        setLatestPosts(posts.slice(0, 3));
      } catch (err) {
        console.error("Failed to load posts in home:", err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchLatestPosts();
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <LatestArrivalsSection
        products={latestProducts}
        loading={latestProductsLoading}
        error={latestProductsError}
        categories={categories}
      />
      <FeaturedProductsSection
        products={featuredProducts}
        loading={featuredProductsLoading}
        error={featuredProductsError}
        categories={categories}
      />
      <ValueSignalsSection />
      <JournalSection posts={latestPosts} loading={postsLoading} />
    </div>
  );
};

export default HomePage;

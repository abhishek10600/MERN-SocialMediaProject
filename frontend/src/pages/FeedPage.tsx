import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Spinner from "../components/General/Spinner";
import { toast } from "react-toastify";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import FeedSection from "../components/FeedPageComponents/FeedSection";
import { getFeedPosts } from "../api/feed.api";
import type { FeedPost } from "../types/feed";

const FeedPage = () => {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const posts = await getFeedPosts();
        setFeedPosts(posts);
        console.log({ feedPosts });
      } catch (error: any) {
        setServerError(error.message);
        toast.error(error.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container flex">
        <Sidebar />
        {loadingPosts ? (
          <Spinner />
        ) : feedPosts.length === 0 ? (
          <p className="text-white">No posts found</p>
        ) : (
          feedPosts.map((feedPost) => (
            <FeedSection key={feedPost._id} post={feedPost} />
          ))
        )}
        <ChatBar />
      </div>
    </div>
  );
};

export default FeedPage;

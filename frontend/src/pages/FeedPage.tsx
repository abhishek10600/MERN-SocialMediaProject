import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Spinner from "../components/General/Spinner";
import { toast } from "react-toastify";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import { getFeedPosts } from "../api/feed.api";
import type { FeedPostType } from "../types/feed";
import FeedPost from "../components/FeedPageComponents/FeedPost";
import { getSocket } from "../socket";

const FeedPage = () => {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedPosts, setFeedPosts] = useState<FeedPostType[]>([]);

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

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return;
    }

    const handleNewPost = (newPost: FeedPostType) => {
      setFeedPosts((prev) => {
        if (prev.some((p) => p._id === newPost._id)) {
          return prev;
        }
        return [newPost, ...prev];
      });
    };

    socket.on("new_post", handleNewPost);

    return () => {
      socket.off("new_post", handleNewPost);
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto px-4">
          {loadingPosts ? (
            <Spinner />
          ) : feedPosts.length === 0 ? (
            <p className="text-white">No posts found</p>
          ) : (
            feedPosts.map((feedPost) => (
              <FeedPost key={feedPost._id} post={feedPost} />
            ))
          )}
        </div>
        <ChatBar />
      </div>
    </div>
  );
};

export default FeedPage;

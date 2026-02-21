import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "../api/post.api";
import { toast } from "react-toastify";
import type { PostDetailType } from "../types/feed";
import PostContainer from "../components/PostDetailPageComponents/PostContainer";
import AppLayout from "../components/Layout/AppLayout";

const PostDetailPage = () => {
  const { postId } = useParams();

  const [post, setPost] = useState<PostDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;

        const data = await getPostById(postId);
        setPost(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    // <div className="h-screen flex flex-col overflow-hidden">
    //   <Navbar />

    //   <div className="flex flex-1 overflow-hidden">
    //     <Sidebar />

    //     <div className="flex-1 overflow-y-auto px-4">
    //       {loading ? (
    //         <p className="text-white">Loading...</p>
    //       ) : post ? (
    //         <PostContainer post={post} />
    //       ) : (
    //         <p className="text-red-500">Post not found</p>
    //       )}
    //     </div>

    //     <ChatBar />
    //   </div>
    // </div>

    <AppLayout>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : post ? (
        <PostContainer post={post} />
      ) : (
        <p className="text-red-500">Post not found</p>
      )}
    </AppLayout>
  );
};

export default PostDetailPage;

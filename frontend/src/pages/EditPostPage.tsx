import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import EditPostContainer from "../components/EditPostPageComponents/EditPostContainer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserPostById } from "../api/post.api";
import { toast } from "react-toastify";

const EditPostPage = () => {
  const [content, setContent] = useState<string | null>(null);
  const { postId } = useParams();
  useEffect(() => {
    if (!postId) {
      toast.error("Post id not found");
      return;
    }
    const getPostData = async () => {
      const response = await getUserPostById(postId);
      setContent(response[0].content);
    };

    getPostData();
  }, [postId]);
  return (
    <div className="h-screen overflow-hidden bg-black">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-10vh)] overflow-hidden">
        <Sidebar />

        {/* Scrollable Center */}
        <div className="flex-1 overflow-y-auto">
          <EditPostContainer content={content} />
        </div>

        <ChatBar />
      </div>
    </div>
  );
};

export default EditPostPage;

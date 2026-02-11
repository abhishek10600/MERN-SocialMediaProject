import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditPostEditor from "./EditPostEditor";
import Spinner from "../General/Spinner";
import { updatePostContent } from "../../api/post.api";

interface props {
  content: string | null;
}

const EditPostContainer = ({ content }: props) => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setEditorContent(content);
    }
  }, [content]);

  const handleUpdatePost = async () => {
    if (!editorContent || editorContent === "<p></p>") {
      toast.error("Post cannot be empty");
      return;
    }
    try {
      if (!postId) {
        toast.error("Post id is missing");
        return;
      }
      setLoading(true);
      const response = await updatePostContent(postId, editorContent);
      toast.success("Post updated successfully");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (!content) {
    return <div className="text-white p-4">Loading post...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-8 p-4 bg-neutral-900 rounded-xl text-white">
      <h2 className="text-lg font-semibold mb-3">Edit Your Post</h2>

      <EditPostEditor value={editorContent} onChange={setEditorContent} />

      <button
        onClick={handleUpdatePost}
        disabled={loading}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-[#9929EA] text-white flex justify-center items-center gap-1 mt-3"
      >
        {loading ? (
          <div className="flex gap-2">
            <Spinner />
            Updating
          </div>
        ) : (
          "Update Post"
        )}
      </button>
    </div>
  );
};

export default EditPostContainer;

import React, { useState } from "react";
import { createPost } from "../../api/post.api";
import PostEditor from "./PostEditor";
import { toast } from "react-toastify";
import Spinner from "../General/Spinner";
import { ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadPostContainer = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreatePost = async () => {
    if (!content || content === "<p></p>") {
      toast.error("Post cannot be empty");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
      const response = await createPost(formData);
      console.log(response);
      toast.success("Post uploaded successfully");
      setContent("");
      setImage(null);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-8 p-4 bg-neutral-900 rounded-xl text-white">
      <h2 className="text-lg font-semibold mb-3">Create Your Post</h2>

      {/* TipTap Rch Text Editor */}
      <PostEditor value={content} onChange={setContent} />

      {/* Image Upload */}
      <div className="mt-4">
        {!image ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#9929EA] hover:bg-white/5 transition">
            <ImagePlus size={28} className="mb-2 text-white/60" />
            <span className="text-sm text-white/70">
              Click to upload an image
            </span>
            <span className="text-xs text-white/40 mt-1">
              PNG, JPG, JPEG supported
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="rounded-xl max-h-72 w-full object-cover"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreatePost}
        disabled={loading}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-[#9929EA] text-white flex justify-center items-center gap-1 mt-3"
      >
        {loading ? (
          <div className="flex gap-2">
            <Spinner />
            Posting
          </div>
        ) : (
          "Post"
        )}
      </button>
    </div>
  );
};

export default UploadPostContainer;

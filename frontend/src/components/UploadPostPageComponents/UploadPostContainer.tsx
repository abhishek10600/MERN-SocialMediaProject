// import React, { useState } from "react";
// import { createPost } from "../../api/post.api";
// import PostEditor from "./PostEditor";
// import { toast } from "react-toastify";
// import Spinner from "../General/Spinner";
// import { ImagePlus, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const UploadPostContainer = () => {
//   const navigate = useNavigate();
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleCreatePost = async () => {
//     if (!content || content === "<p></p>") {
//       toast.error("Post cannot be empty");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("content", content);
//       if (image) {
//         formData.append("image", image);
//       }
//       setLoading(true);
//       const response = await createPost(formData);
//       console.log(response);
//       toast.success("Post uploaded successfully");
//       setContent("");
//       setImage(null);
//       navigate("/");
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.message || "Failed to upload post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-6 mb-8 p-4 bg-neutral-900 rounded-xl text-white">
//       <h2 className="text-lg font-semibold mb-3">Create Your Post</h2>

//       {/* TipTap Rch Text Editor */}
//       <PostEditor value={content} onChange={setContent} />

//       {/* Image Upload */}
//       <div className="mt-4">
//         {!image ? (
//           <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#9929EA] hover:bg-white/5 transition">
//             <ImagePlus size={28} className="mb-2 text-white/60" />
//             <span className="text-sm text-white/70">
//               Click to upload an image
//             </span>
//             <span className="text-xs text-white/40 mt-1">
//               PNG, JPG, JPEG supported
//             </span>
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={(e) => {
//                 if (e.target.files?.[0]) {
//                   setImage(e.target.files[0]);
//                 }
//               }}
//             />
//           </label>
//         ) : (
//           <div className="relative">
//             <img
//               src={URL.createObjectURL(image)}
//               alt="preview"
//               className="rounded-xl max-h-72 w-full object-cover"
//             />
//             <button
//               onClick={() => setImage(null)}
//               className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full"
//               title="Remove image"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleCreatePost}
//         disabled={loading}
//         className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-[#9929EA] text-white flex justify-center items-center gap-1 mt-3"
//       >
//         {loading ? (
//           <div className="flex gap-2">
//             <Spinner />
//             Posting
//           </div>
//         ) : (
//           "Post"
//         )}
//       </button>
//     </div>
//   );
// };

// export default UploadPostContainer;

import React, { useState } from "react";
import { createPost } from "../../api/post.api";
import PostEditor from "./PostEditor";
import { toast } from "react-toastify";
import Spinner from "../General/Spinner";
import { ImagePlus, VideoIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MediaType = "image" | "video" | null;

const UploadPostContainer = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: MediaType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview URL to avoid memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setMediaFile(file);
    setMediaType(type);
    setPreviewUrl(URL.createObjectURL(file));

    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  };

  const handleRemoveMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setMediaFile(null);
    setMediaType(null);
    setPreviewUrl(null);
  };

  const handleCreatePost = async () => {
    if (!content || content === "<p></p>") {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (mediaFile && mediaType === "image") {
        formData.append("image", mediaFile);
      } else if (mediaFile && mediaType === "video") {
        formData.append("video", mediaFile);
      }

      setLoading(true);
      const response = await createPost(formData);
      console.log(response);
      toast.success("Post uploaded successfully");
      setContent("");
      handleRemoveMedia();
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

      {/* TipTap Rich Text Editor */}
      <PostEditor value={content} onChange={setContent} />

      {/* Media Upload */}
      <div className="mt-4">
        {!mediaFile ? (
          // Two upload zones — shown when no file is selected
          <div className="grid grid-cols-2 gap-3">
            {/* Image Upload */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#9929EA] hover:bg-white/5 transition">
              <ImagePlus size={28} className="mb-2 text-white/60" />
              <span className="text-sm text-white/70">Upload Image</span>
              <span className="text-xs text-white/40 mt-1">PNG, JPG, JPEG</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "image")}
              />
            </label>

            {/* Video Upload */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#9929EA] hover:bg-white/5 transition">
              <VideoIcon size={28} className="mb-2 text-white/60" />
              <span className="text-sm text-white/70">Upload Video</span>
              <span className="text-xs text-white/40 mt-1">MP4, MOV, WEBM</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "video")}
              />
            </label>
          </div>
        ) : (
          // Preview — replaces both zones once a file is selected
          <div className="relative">
            {mediaType === "image" && previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="rounded-xl max-h-72 w-full object-cover"
              />
            )}

            {mediaType === "video" && previewUrl && (
              // Local blob preview uses plain <video>.
              // Cloudinary .m3u8 HLS URLs in the feed are played via HLSVideoPlayer.
              <video
                src={previewUrl}
                controls
                className="rounded-xl max-h-72 w-full object-contain bg-black"
              />
            )}

            {/* File name badge */}
            <div className="mt-2 flex items-center gap-1 text-xs text-white/50">
              {mediaType === "image" ? (
                <ImagePlus size={12} />
              ) : (
                <VideoIcon size={12} />
              )}
              <span className="truncate max-w-xs">{mediaFile.name}</span>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemoveMedia}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full"
              title="Remove media"
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

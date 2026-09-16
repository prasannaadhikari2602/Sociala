import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FiImage, FiX } from "react-icons/fi";
import { useCreatePostMutation } from "../../features/posts/postApi";

const PostComposer = () => {
  const currentUser = useSelector((s) => s.auth.user);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef(null);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!content.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("visibility", visibility);
    images.forEach((img) => formData.append("images", img));

    await createPost(formData);
    setContent("");
    setImages([]);
    setPreviews([]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 resize-none rounded-xl border border-slate-200 p-3 text-sm"
          rows={3}
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative">
              <img src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600"
          >
            <FiImage size={18} />
            Photos
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button
          onClick={submit}
          disabled={isLoading}
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition disabled:opacity-60"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
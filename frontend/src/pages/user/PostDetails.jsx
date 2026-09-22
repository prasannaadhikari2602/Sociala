import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiX,
  FiHeart,
  FiMessageCircle,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiImage,
  FiFlag,
} from "react-icons/fi";

import {
  useGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../../features/posts/postApi";
import { openReportModal } from "../../features/reports/reportSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import CommentList from "./CommentList";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PostDetails = ({ postId, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostQuery(postId, { skip: !postId });

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [updatePost, { isLoading: isSaving }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [actionError, setActionError] = useState("");

  // The post's author id can come through as `user` (nested object) or
  // `user_id` depending on the serializer — check both. Compare as
  // strings so a number-vs-string id mismatch (e.g. 5 vs "5") never
  // silently breaks ownership detection.
  const authorId = post?.user?.id ?? post?.user_id;
  const isOwner = Boolean(
    currentUser &&
      authorId != null &&
      String(currentUser.id) === String(authorId)
  );

  const handleClose = () => {
    onClose?.();
  };

  const handleToggleLike = async () => {
    if (!post || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (post.is_liked) {
        await unlikePost(post.id).unwrap();
      } else {
        await likePost(post.id).unwrap();
      }
    } catch (err) {
      console.error("Like action failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = () => {
    setEditText(post.caption ?? post.content ?? "");
    setEditImageFile(null);
    setEditImagePreview(null);
    setActionError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditImageFile(null);
    setEditImagePreview(null);
    setActionError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    if (!post || !isOwner) return;
    setActionError("");

    // Preserve whichever field name the post actually uses
    const captionField = "caption" in post ? "caption" : "content";

    const formData = new FormData();
    formData.append(captionField, editText);
    if (editImageFile) {
      formData.append("image", editImageFile);
    }

    try {
      await updatePost({ id: post.id, formData }).unwrap();
      setIsEditing(false);
      setEditImageFile(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error("Update post failed:", err);
      setActionError("Couldn't save changes. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!post || !isOwner) return;
    setActionError("");
    try {
      await deletePost(post.id).unwrap();
      handleClose();
    } catch (err) {
      console.error("Delete post failed:", err);
      setActionError("Couldn't delete this post. Please try again.");
      setConfirmingDelete(false);
    }
  };

  if (!postId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex w-full max-w-2xl flex-col
          overflow-hidden
          rounded-t-2xl sm:rounded-2xl
          bg-white
          shadow-xl
          max-h-[90vh]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-[#12111A]">Post</h2>

          <div className="flex items-center gap-1.5">
            {post && !isEditing && !confirmingDelete && (
              <>
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={startEditing}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch(openReportModal(post.id))}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
                  >
                    <FiFlag size={14} />
                    Report
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-[#A855F7]" />
            </div>
          )}

          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
              <p className="text-sm text-slate-500">Couldn't load this post.</p>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          )}

          {!isLoading && !isError && post && (
            <>
              {/* Delete confirmation */}
              {confirmingDelete && isOwner && (
                <div className="mx-5 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 sm:mx-6">
                  <p className="text-sm font-medium text-red-700">
                    Delete this post? This can't be undone.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Image (view mode) */}
              {!isEditing && post.image && (
                <div className="max-h-[50vh] w-full overflow-hidden bg-black">
                  <img
                    src={post.image}
                    alt={post.caption || "Post"}
                    className="mx-auto max-h-[50vh] w-full object-contain"
                  />
                </div>
              )}

              {/* Image (edit mode preview) — only owners ever reach this branch,
                  since isEditing can only be set true via startEditing(),
                  which is only wired to a button rendered when isOwner is true */}
              {isEditing && isOwner && (
                <div className="relative max-h-[40vh] w-full overflow-hidden bg-black">
                  <img
                    src={editImagePreview || post.image}
                    alt="Preview"
                    className="mx-auto max-h-[40vh] w-full object-contain"
                  />

                  <label
                    className="
                      absolute bottom-3 right-3
                      flex items-center gap-1.5
                      rounded-lg bg-black/70 px-3 py-1.5
                      text-xs font-medium text-white
                      backdrop-blur-md
                      cursor-pointer
                      transition hover:bg-black/85
                    "
                  >
                    <FiImage size={14} />
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="px-5 py-4 sm:px-6">
                {actionError && (
                  <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {actionError}
                  </p>
                )}

                {!isEditing || !isOwner ? (
                  <>
                    {(post.caption || post.content) && (
                      <p className="text-sm leading-6 text-slate-700">
                        {post.caption || post.content}
                      </p>
                    )}

                    {post.created_at && (
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(post.created_at)}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={handleToggleLike}
                        disabled={isSubmitting}
                        className={`
                          flex items-center gap-1.5 text-sm font-semibold
                          transition
                          ${post.is_liked ? "text-[#A855F7]" : "text-slate-500 hover:text-[#A855F7]"}
                        `}
                      >
                        <FiHeart
                          size={17}
                          fill={post.is_liked ? "currentColor" : "none"}
                        />
                        {post.likes_count ?? 0}
                      </button>

                      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                        <FiMessageCircle size={17} />
                        {post.comments_count ?? 0}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <CommentList postId={post.id} />
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      placeholder="Write a caption..."
                      className="
                        w-full resize-none
                        rounded-xl border border-slate-200
                        px-3 py-2.5
                        text-sm text-slate-700
                        outline-none
                        focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100
                      "
                    />

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="
                          flex items-center gap-1.5
                          rounded-lg bg-[#A855F7]
                          px-4 py-2
                          text-xs font-semibold text-white
                          transition hover:bg-[#9333EA]
                          disabled:opacity-60
                        "
                      >
                        <FiCheck size={14} />
                        {isSaving ? "Saving..." : "Save changes"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="
                          rounded-lg border border-slate-200
                          px-4 py-2
                          text-xs font-semibold text-slate-600
                          transition hover:bg-slate-50
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiHeart, FiMessageCircle, FiShare2, FiRepeat, FiMoreHorizontal, FiFlag } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../features/posts/postApi";
import {
  useSharePostMutation,
  useUnsharePostMutation,
} from "../../features/shares/shareApi";
import { openReportModal } from "../../features/reports/reportSlice";
import ShareComposerModal from "./ShareComposerModal";
import PostDetails from "./PostDetails";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const Avatar = ({ user, size = 40 }) => {
  const initials = (user?.full_name || user?.username || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      style={{ height: size, width: size }}
      className="overflow-hidden rounded-full bg-slate-100 shrink-0"
    >
      {user?.profile_image ? (
        <img
          src={user.profile_image}
          alt={user.full_name || user.username}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-50 text-sm font-bold text-[#A855F7]">
          {initials}
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  // `shared_by` present => this feed item is a re-share; the actual post
  // content lives under `post.post` in that case.
  const sharedBy = post.shared_by ?? null;
  const originalPost = sharedBy ? post.post ?? post : post;

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [sharePost, { isLoading: isSharing }] = useSharePostMutation();
  const [unsharePost] = useUnsharePostMutation();

  const [isLiking, setIsLiking] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareError, setShareError] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const author = originalPost.author ?? originalPost.user ?? {};

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (originalPost.is_liked) {
        await unlikePost(originalPost.id).unwrap();
      } else {
        await likePost(originalPost.id).unwrap();
      }
    } catch (err) {
      console.error("Like action failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleConfirmShare = async (caption) => {
    setShareError("");
    try {
      await sharePost({ post: originalPost.id, caption }).unwrap();
      setIsShareModalOpen(false);
    } catch (err) {
      console.error("Share failed:", err);
      setShareError("Couldn't share this post. Please try again.");
    }
  };

  const handleUnshare = async () => {
    // share_id lives on the top-level feed item (the wrapper), not on the
    // nested original post — originalPost never carries it.
    if (!post.share_id) return;
    try {
      await unsharePost(post.share_id).unwrap();
    } catch (err) {
      console.error("Unshare failed:", err);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      {/* "Shared by" banner */}
      {sharedBy && (
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <FiRepeat size={14} className="text-[#A855F7]" />
          <span>
            {sharedBy.full_name || sharedBy.username} shared this
          </span>
        </div>
      )}

      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar user={author} />

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate text-sm font-semibold text-[#12111A]">
                {author.full_name || author.username}
              </p>
              {author.is_verified && (
                <MdVerified size={13} className="text-[#A855F7]" />
              )}
            </div>
            <p className="text-xs text-slate-400">
              {formatDate(originalPost.created_at)}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Post options"
          >
            <FiMoreHorizontal size={18} />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    dispatch(openReportModal(originalPost.id));
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <FiFlag size={14} />
                  Report post
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Optional share caption (the re-sharer's own comment) */}
      {sharedBy && post.caption && (
        <p className="mt-3 text-sm leading-6 text-slate-700">{post.caption}</p>
      )}

      {/* Original post content, boxed if it's a share */}
      <div className={sharedBy ? "mt-3 rounded-xl border border-slate-100 p-3" : "mt-3"}>
        {(originalPost.caption || originalPost.content) && (
          <p className="text-sm leading-6 text-slate-700">
            {originalPost.caption || originalPost.content}
          </p>
        )}

        {originalPost.image && (
          <div className="mt-3 overflow-hidden rounded-xl bg-slate-100">
            <img
              src={originalPost.image}
              alt={originalPost.caption || "Post"}
              className="max-h-[420px] w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`
            flex items-center gap-1.5 text-sm font-semibold
            transition
            ${originalPost.is_liked ? "text-[#A855F7]" : "text-slate-500 hover:text-[#A855F7]"}
          `}
        >
          <FiHeart size={17} fill={originalPost.is_liked ? "currentColor" : "none"} />
          {originalPost.likes_count ?? 0}
        </button>

        {/* There is no /posts/:id route in the app router — PostDetails is a
            modal, not a page, so it opens here rather than navigating. */}
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#A855F7]"
        >
          <FiMessageCircle size={17} />
          {originalPost.comments_count ?? 0}
        </button>

        {originalPost.is_shared_by_me ? (
          <button
            type="button"
            onClick={handleUnshare}
            className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-[#A855F7]"
          >
            <FiShare2 size={16} />
            Shared
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#A855F7]"
          >
            <FiShare2 size={16} />
            Share
          </button>
        )}
      </div>

      {shareError && (
        <p className="mt-2 text-xs text-red-500">{shareError}</p>
      )}

      {isShareModalOpen && (
        <ShareComposerModal
          isSharing={isSharing}
          onClose={() => setIsShareModalOpen(false)}
          onConfirm={handleConfirmShare}
        />
      )}

      {isDetailsOpen && (
        <PostDetails
          postId={originalPost.id}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
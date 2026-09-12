import { useState } from "react";
import { FiHeart, FiMessageCircle, FiSend } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";

import { useLikePostMutation, useUnlikePostMutation } from "../../features/posts/postApi";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
} from "../../features/comments/commentApi";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const ExplorePostCard = ({ post }) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [isLiking, setIsLiking] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useGetCommentsQuery(post.id, { skip: !commentsOpen });

  const [createComment, { isLoading: isPostingComment }] = useCreateCommentMutation();

  const author = post.author ?? post.user ?? {};

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (post.is_liked) {
        await unlikePost(post.id).unwrap();
      } else {
        await likePost(post.id).unwrap();
      }
    } catch (err) {
      console.error("Like action failed:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async () => {
    const content = commentText.trim();
    if (!content || isPostingComment) return;

    try {
      await createComment({ post: post.id, content }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const commentList = Array.isArray(comments) ? comments : comments?.results ?? [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

      {/* Author row */}
      <Link to={`/profile/${author.id}`} className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {author.profile_image ? (
            <img
              src={author.profile_image}
              alt={author.full_name || author.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-50 text-sm font-bold text-[#A855F7]">
              {(author.full_name || author.username || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-semibold text-[#12111A]">
              {author.full_name || author.username}
            </p>
            {author.is_verified && <MdVerified size={13} className="text-[#A855F7]" />}
          </div>
          <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
        </div>
      </Link>

      {/* Content */}
      {(post.caption || post.content) && (
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {post.caption || post.content}
        </p>
      )}

      {post.image && (
        <div className="mt-3 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={post.image}
            alt={post.caption || "Post"}
            className="max-h-[420px] w-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`
            flex items-center gap-1.5 text-sm font-semibold
            transition
            ${post.is_liked ? "text-[#A855F7]" : "text-slate-500 hover:text-[#A855F7]"}
          `}
        >
          <FiHeart size={17} fill={post.is_liked ? "currentColor" : "none"} />
          {post.likes_count ?? 0}
        </button>

        <button
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#A855F7]"
        >
          <FiMessageCircle size={17} />
          {post.comments_count ?? 0}
        </button>
      </div>

      {/* Comments panel */}
      {commentsOpen && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          {commentsLoading && (
            <p className="py-3 text-center text-xs text-slate-400">Loading comments...</p>
          )}

          {!commentsLoading && commentList.length === 0 && (
            <p className="py-3 text-center text-xs text-slate-400">
              No comments yet. Be the first to comment.
            </p>
          )}

          {!commentsLoading && commentList.length > 0 && (
            <div className="flex flex-col gap-3">
              {commentList.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-100">
                    {c.author?.profile_image ? (
                      <img
                        src={c.author.profile_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-50 text-[10px] font-bold text-[#A855F7]">
                        {(c.author?.full_name || c.author?.username || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl bg-[#F6F7FB] px-3 py-2">
                    <p className="text-xs font-semibold text-[#12111A]">
                      {c.author?.full_name || c.author?.username}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          <div className="mt-3 flex items-center gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitComment();
              }}
              placeholder="Write a comment..."
              className="
                flex-1 rounded-xl border border-slate-200
                px-3 py-2 text-xs text-slate-700
                outline-none
                focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100
              "
            />

            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isPostingComment}
              className="
                flex items-center justify-center
                rounded-xl bg-[#A855F7]
                p-2.5 text-white
                transition hover:bg-[#9333EA]
                disabled:opacity-50
              "
              aria-label="Send comment"
            >
              <FiSend size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePostCard;
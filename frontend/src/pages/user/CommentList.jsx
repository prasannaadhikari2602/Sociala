import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useCreateCommentMutation,
} from "../../features/comments/commentApi";

const ReplyItem = ({ reply }) => (
  <div className="flex gap-3 py-2">
    <img
      src={reply.user.profile_image || "/default-avatar.png"}
      className="h-6 w-6 rounded-full object-cover"
      alt=""
    />
    <p className="text-sm">
      <span className="font-semibold">{reply.user.full_name}</span>{" "}
      <span className="text-slate-600">{reply.content}</span>
    </p>
  </div>
);

const CommentItem = ({ comment, postId }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [createComment] = useCreateCommentMutation();

  // Only fetch replies once the user actually opens them.
  const {
    data: replies,
    isLoading: repliesLoading,
  } = useGetRepliesQuery(
    { postId, parentId: comment.id },
    { skip: !showReplies }
  );

  // Prefer a server-provided count if your serializer includes one
  // (e.g. reply_count / replies_count); otherwise fall back to the
  // length of whatever we've fetched so far.
  const replyCount =
    comment.reply_count ?? comment.replies_count ?? replies?.length ?? 0;

  const submitReply = async () => {
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await createComment({ post: postId, content: replyText, parent: comment.id }).unwrap();
      setReplyText("");
      setReplying(false);
      setShowReplies(true); // reveal the thread so the new reply is visible
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="py-3">
      <div className="flex gap-3">
        <img
          src={comment.user.profile_image || "/default-avatar.png"}
          className="h-8 w-8 rounded-full object-cover"
          alt=""
        />
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold">{comment.user.full_name}</span>{" "}
            <span className="text-slate-600">{comment.content}</span>
          </p>

          <div className="mt-1 flex items-center gap-3">
            <button
              onClick={() => setReplying((v) => !v)}
              className="text-xs font-medium text-slate-400 hover:text-[#A855F7]"
            >
              Reply
            </button>

            {(replyCount > 0 || showReplies) && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="text-xs font-medium text-slate-400 hover:text-[#A855F7]"
              >
                {showReplies
                  ? "Hide replies"
                  : `View ${replyCount > 0 ? replyCount : ""} ${
                      replyCount === 1 ? "reply" : "replies"
                    }`}
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitReply()}
                placeholder="Write a reply..."
                disabled={isSubmittingReply}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-60"
              />
              <button
                onClick={submitReply}
                disabled={isSubmittingReply}
                className="rounded-lg bg-[#A855F7] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isSubmittingReply ? "Sending..." : "Send"}
              </button>
            </div>
          )}

          {showReplies && (
            <div className="mt-2 ml-4 border-l border-slate-100 pl-3">
              {repliesLoading && (
                <p className="py-2 text-xs text-slate-400">Loading replies...</p>
              )}
              {!repliesLoading && replies?.length === 0 && (
                <p className="py-2 text-xs text-slate-400">No replies yet.</p>
              )}
              {replies?.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentList = ({ postId }) => {
  const { data: comments, isLoading, isError } = useGetCommentsQuery(postId, { skip: !postId });
  const [content, setContent] = useState("");
  const [createComment] = useCreateCommentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const currentUser = useSelector((s) => s.auth.user);

  const submit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await createComment({ post: postId, content }).unwrap();
      setContent("");
    } catch (err) {
      console.error("Comment failed:", err);
      setSubmitError("Couldn't post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-1">
        {isLoading && <p className="py-4 text-center text-sm text-slate-400">Loading comments...</p>}
        {isError && (
          <p className="py-4 text-center text-sm text-slate-400">Couldn't load comments.</p>
        )}
        {comments?.length ? (
          comments.map((c) => <CommentItem key={c.id} comment={c} postId={postId} />)
        ) : (
          !isLoading && !isError && (
            <p className="py-6 text-center text-sm text-slate-400">No comments yet.</p>
          )
        )}
      </div>

      {submitError && (
        <p className="mt-2 text-xs text-red-500">{submitError}</p>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
        <img
          src={currentUser?.profile_image || "/default-avatar.png"}
          className="h-8 w-8 rounded-full object-cover"
          alt=""
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a comment..."
          disabled={isSubmitting}
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={isSubmitting}
          className="rounded-full bg-[#A855F7] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CommentList;
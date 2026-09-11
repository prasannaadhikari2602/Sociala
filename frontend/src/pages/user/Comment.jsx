import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetCommentsQuery, useCreateCommentMutation } from "../../features/comments/commentApi";

const CommentItem = ({ comment, postId }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [createComment] = useCreateCommentMutation();

  const submitReply = async () => {
    if (!replyText.trim()) return;
    await createComment({ post: postId, content: replyText, parent: comment.id });
    setReplyText("");
    setReplying(false);
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
          <button
            onClick={() => setReplying((v) => !v)}
            className="mt-1 text-xs font-medium text-slate-400 hover:text-[#A855F7]"
          >
            Reply
          </button>

          {replying && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <button
                onClick={submitReply}
                className="rounded-lg bg-[#A855F7] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentList = ({ postId }) => {
  const { data: comments, isLoading } = useGetCommentsQuery(postId);
  const [content, setContent] = useState("");
  const [createComment] = useCreateCommentMutation();
  const currentUser = useSelector((s) => s.auth.user);

  const submit = async () => {
    if (!content.trim()) return;
    await createComment({ post: postId, content });
    setContent("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-1">
        {isLoading && <p className="py-4 text-center text-sm text-slate-400">Loading comments...</p>}
        {comments?.length ? (
          comments.map((c) => <CommentItem key={c.id} comment={c} postId={postId} />)
        ) : (
          !isLoading && <p className="py-6 text-center text-sm text-slate-400">No comments yet.</p>
        )}
      </div>

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
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm"
        />
        <button
          onClick={submit}
          className="rounded-full bg-[#A855F7] px-4 py-2 text-xs font-semibold text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentList;
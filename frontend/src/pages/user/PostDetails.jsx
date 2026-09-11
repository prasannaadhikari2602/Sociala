import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { useGetPostQuery } from "../../features/posts/postApi";
import { closePostDetails } from "../../features/posts/postSlice";
import CommentList from "./Comment";
import PostCard from "../shared/PostCard";

const PostDetails = () => {
  const dispatch = useDispatch();
  const activePostId = useSelector((s) => s.posts.activePostId);
  const { data: post, isLoading } = useGetPostQuery(activePostId, { skip: !activePostId });

  if (!activePostId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold">Post</h2>
          <button onClick={() => dispatch(closePostDetails())}>
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading || !post ? (
            <p className="text-center text-sm text-slate-400">Loading...</p>
          ) : (
            <>
              <PostCard post={post} />
              <div className="mt-4 h-[45vh]">
                <CommentList postId={post.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
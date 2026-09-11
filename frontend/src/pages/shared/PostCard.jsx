import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiShare2, FiFlag, FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useDeletePostMutation,
} from "../../features/posts/postApi";
import { useSharePostMutation, useUnsharePostMutation } from "../../features/shares/shareApi";
import { openPostDetails } from "../../features/posts/postSlice";
import { openReportModal } from "../../features/reports/reportSlice";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.user);
  const [like] = useLikePostMutation();
  const [unlike] = useUnlikePostMutation();
  const [share] = useSharePostMutation();
  const [unshare] = useUnsharePostMutation();
  const [deletePost] = useDeletePostMutation();

  const isOwner = currentUser?.id === post.user.id;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${post.user.id}`} className="flex items-center gap-3">
          <img
            src={post.user.profile_image || "/default-avatar.png"}
            alt={post.user.username}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{post.user.full_name}</p>
            <p className="text-xs text-slate-500">@{post.user.username}</p>
          </div>
        </Link>

        {isOwner && (
          <button onClick={() => deletePost(post.id)} className="text-slate-400 hover:text-red-500">
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      {post.content && <p className="mt-3 text-sm text-slate-700">{post.content}</p>}

      {post.images?.length > 0 && (
        <div className={`mt-3 grid gap-1 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {post.images.map((img) => (
            <img key={img.id} src={img.image} alt="" className="h-56 w-full rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 text-slate-500">
        <button
          onClick={() => (post.is_liked ? unlike(post.id) : like(post.id))}
          className={`flex items-center gap-1.5 text-sm ${post.is_liked ? "text-pink-500" : ""}`}
        >
          <FiHeart size={17} fill={post.is_liked ? "currentColor" : "none"} />
          {post.like_count}
        </button>

        <button
          onClick={() => dispatch(openPostDetails(post.id))}
          className="flex items-center gap-1.5 text-sm"
        >
          <FiMessageCircle size={17} />
          {post.comment_count}
        </button>

        <button
          onClick={() => (post.is_shared ? unshare(post.id) : share({ post: post.id, caption: "" }))}
          className={`flex items-center gap-1.5 text-sm ${post.is_shared ? "text-[#A855F7]" : ""}`}
        >
          <FiShare2 size={17} />
          {post.share_count}
        </button>

        {!isOwner && (
          <button
            onClick={() => dispatch(openReportModal(post.id))}
            className="ml-auto flex items-center gap-1.5 text-sm hover:text-red-500"
          >
            <FiFlag size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
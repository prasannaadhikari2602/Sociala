import { useSelector } from "react-redux";
import { useGetFeedQuery } from "../../features/posts/postApi";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";
import { FiUsers, FiAlertCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Feed = () => {
  const { data: posts, isLoading, isError } = useGetFeedQuery();
  const currentUser = useSelector((s) => s.auth.user);

  // Only show a feed item if the underlying post is public, or if it
  // belongs to the current user (so your own private/friends-only posts
  // still show up in your own feed). Handles both a flat shape
  // ({ visibility, user }) and a share wrapping the original post
  // ({ post: { visibility, user } }).
  const visiblePosts = posts?.filter((item) => {
    const visibility = item.visibility ?? item.post?.visibility;
    const ownerId = item.user?.id ?? item.post?.user?.id;
    return visibility === "public" || (currentUser && ownerId === currentUser.id);
  });

  if (isLoading) {
    return (
      <div className="relative w-full min-w-0 min-h-[60vh] bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-14 sm:py-20 shadow-sm text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse">
              <HiOutlineSparkles size={24} />
            </div>
            <p className="text-sm sm:text-base text-slate-500">
              Loading your feed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-w-0 min-h-[60vh] bg-white">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 sm:py-20 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
              Couldn't load feed
            </h3>
            <p className="text-sm sm:text-base text-slate-500 max-w-sm">
              Something went wrong while fetching your feed. Please try
              again in a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0 bg-white overflow-x-hidden">
      {/* Subtle background glow, matches site theme */}
      <div className="absolute inset-0 pointer-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-2xl xl:max-w-3xl px-3 sm:px-6 py-4 sm:py-8">
        {/* Composer */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm w-full min-w-0 overflow-hidden wrap-break-words wrap-anywhere">
          <PostComposer />
        </div>

        {/* Posts */}
        <div className="mt-4 sm:mt-6 flex flex-col gap-4 sm:gap-5 min-w-0">
          {visiblePosts?.length ? (
            visiblePosts.map((item) => (
              <div
                // A share and its original post can share the same post id,
                // so key on the share id when present to avoid collisions.
                key={item.share_id ? `share-${item.share_id}` : `post-${item.id}`}
                className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition min-w-0 w-full overflow-hidden wrap-break-words wrap-anywhere"
              >
                <PostCard post={item} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 sm:py-20 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiUsers size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Nothing here yet
              </h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Follow people to see their posts show up in your feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
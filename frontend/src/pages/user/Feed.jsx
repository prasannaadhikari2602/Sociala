import { useGetFeedQuery } from "../../features/posts/postApi";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

const Feed = () => {
  const { data: posts, isLoading, isError } = useGetFeedQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-slate-500">
        Loading feed...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-slate-500">
        Couldn't load feed.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PostComposer />

      <div className="mt-6 flex flex-col gap-5">
        {posts?.length ? (
          posts.map((item) => (
            <PostCard
              // A share and its original post can share the same post id,
              // so key on the share id when present to avoid collisions.
              key={item.share_id ? `share-${item.share_id}` : `post-${item.id}`}
              post={item}
            />
          ))
        ) : (
          <p className="text-center text-sm text-slate-500">
            Nothing here yet — follow people to see their posts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
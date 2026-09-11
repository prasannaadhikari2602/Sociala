import { useGetFeedQuery } from "../../features/posts/postApi";
import PostCard from "../shared/PostCard";
import PostComposer from "../shared/PostComposer";

const Feed = () => {
  const { data: posts, isLoading, isError } = useGetFeedQuery();

  if (isLoading) return <div className="py-10 text-center text-slate-500">Loading feed...</div>;
  if (isError) return <div className="py-10 text-center text-slate-500">Couldn't load feed.</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PostComposer />
      <div className="mt-6 flex flex-col gap-5">
        {posts?.length ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
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
import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { useGetMyPostsQuery } from "../../features/posts/postApi";
import PostCard from "../shared/PostCard";
import PostComposer from "../shared/PostComposer";

const Posts = () => {
  const { data: posts, isLoading, isError } = useGetMyPostsQuery();
  const [view, setView] = useState("list");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PostComposer />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base font-bold">My Posts</h2>
        <div className="flex items-center rounded-xl bg-[#F6F7FB] p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 ${view === "grid" ? "bg-white text-[#A855F7] shadow-sm" : "text-slate-400"}`}
          >
            <FiGrid size={17} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 ${view === "list" ? "bg-white text-[#A855F7] shadow-sm" : "text-slate-400"}`}
          >
            <FiList size={17} />
          </button>
        </div>
      </div>

      {isLoading && <p className="py-8 text-center text-sm text-slate-400">Loading...</p>}
      {isError && <p className="py-8 text-center text-sm text-slate-400">Couldn't load posts.</p>}

      {view === "list" ? (
        <div className="mt-4 flex flex-col gap-5">
          {posts?.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-1">
          {posts?.map((post) => (
            <div key={post.id} className="aspect-square overflow-hidden rounded-lg bg-slate-100">
              {post.images?.[0] ? (
                <img src={post.images[0].image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-slate-500">
                  {post.content?.slice(0, 60)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && !posts?.length && (
        <p className="py-10 text-center text-sm text-slate-400">You haven't posted anything yet.</p>
      )}
    </div>
  );
};

export default Posts;
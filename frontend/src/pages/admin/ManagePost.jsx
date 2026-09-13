import { useState } from "react";
import { useGetAdminPostsQuery, useAdminDeletePostMutation } from "../../features/posts/postApi";

const ManagePost = () => {
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const { data: posts, isLoading, isFetching } = useGetAdminPostsQuery({ search });
  const [adminDeletePost] = useAdminDeletePostMutation();

  const handleDelete = async (post) => {
    const confirmed = window.confirm(
      `Remove this post by @${post.user?.username || post.username}? This can't be undone.`
    );
    if (!confirmed) return;

    setBusyId(post.id);
    try {
      await adminDeletePost(post.id).unwrap();
    } catch (err) {
      alert(err?.data?.detail || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold">Manage Posts</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by content or username"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {(isLoading || isFetching) && (
          <p className="text-center text-sm text-slate-400">Loading posts...</p>
        )}

        {!isLoading &&
          posts?.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-semibold">
                    @{post.user?.username || post.username}
                  </span>{" "}
                  <span className="text-xs text-slate-400 capitalize">
                    · {post.visibility}
                  </span>
                </p>
                <button
                  type="button"
                  disabled={busyId === post.id}
                  onClick={() => handleDelete(post)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete post
                </button>
              </div>

              {post.content && (
                <div className="mt-3 rounded-lg border border-slate-100 bg-[#F8F8FA] p-3">
                  <p className="text-sm">{post.content}</p>
                </div>
              )}
            </div>
          ))}

        {!isLoading && !posts?.length && (
          <p className="py-10 text-center text-sm text-slate-400">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagePost;
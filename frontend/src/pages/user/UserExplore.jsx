import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiGrid, FiSearch } from "react-icons/fi";

import {
  useExploreUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../features/follows/followApi";
import { useExplorePostsQuery } from "../../features/posts/postApi";
import ExplorePostCard from "./ExplorePostCard";
import Pagination from "./Pagination";

const TABS = [
  { key: "all", label: "All" },
  { key: "people", label: "People" },
  { key: "posts", label: "Posts" },
];

const UserExplore = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [peoplePage, setPeoplePage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);

  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  // Debounce search input so we don't refetch on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  // Reset to page 1 whenever the search term or tab changes
  useEffect(() => {
    setPeoplePage(1);
    setPostsPage(1);
  }, [debouncedSearch, activeTab]);

  const showPeople = activeTab === "all" || activeTab === "people";
  const showPosts = activeTab === "all" || activeTab === "posts";

  // In "All" mode we only show a short preview of each (no pagination);
  // in a dedicated tab we paginate 20 per page.
  const peopleQueryArgs = { search: debouncedSearch, page: activeTab === "people" ? peoplePage : 1 };
  const postsQueryArgs = { search: debouncedSearch, page: activeTab === "posts" ? postsPage : 1 };

  const {
    data: peopleData,
    isLoading: peopleLoading,
  } = useExploreUsersQuery(peopleQueryArgs, { skip: !showPeople });

  const {
    data: postsData,
    isLoading: postsLoading,
  } = useExplorePostsQuery(postsQueryArgs, { skip: !showPosts });

  // Normalize both paginated ({count, next, previous, results}) and
  // plain-array responses so this works whether or not the backend
  // has been updated to paginate yet.
  const peopleList = Array.isArray(peopleData) ? peopleData : peopleData?.results ?? [];
  const peopleCount = Array.isArray(peopleData) ? peopleList.length : peopleData?.count;
  const peopleHasNext = Array.isArray(peopleData) ? false : Boolean(peopleData?.next);
  const peopleHasPrevious = Array.isArray(peopleData) ? false : Boolean(peopleData?.previous);

  const postsList = Array.isArray(postsData) ? postsData : postsData?.results ?? [];
  const postsCount = Array.isArray(postsData) ? postsList.length : postsData?.count;
  const postsHasNext = Array.isArray(postsData) ? false : Boolean(postsData?.next);
  const postsHasPrevious = Array.isArray(postsData) ? false : Boolean(postsData?.previous);

  const peoplePreview = activeTab === "all" ? peopleList.slice(0, 5) : peopleList;
  const postsPreview = activeTab === "all" ? postsList.slice(0, 5) : postsList;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">

      {/* Search */}
      <div className="relative">
        <FiSearch
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people or posts..."
          className="
            w-full rounded-xl border border-slate-200
            py-3 pl-10 pr-4
            text-sm
            outline-none
            focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100
          "
        />
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F6F7FB] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 rounded-lg px-3 py-2
              text-xs font-semibold
              transition
              ${
                activeTab === tab.key
                  ? "bg-white text-[#A855F7] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PEOPLE SECTION */}
      {showPeople && (
        <div className="mt-6">
          {activeTab === "all" && (
            <div className="mb-2 flex items-center gap-2">
              <FiUsers size={14} className="text-[#A855F7]" />
              <h2 className="text-sm font-bold text-[#12111A]">People</h2>
            </div>
          )}

          {peopleLoading && (
            <p className="py-6 text-center text-sm text-slate-400">Searching people...</p>
          )}

          {!peopleLoading && peoplePreview.length === 0 && (
            <p className="py-4 text-center text-xs text-slate-400">
              {debouncedSearch ? "No people found." : "No suggestions right now."}
            </p>
          )}

          {!peopleLoading && peoplePreview.length > 0 && (
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {peoplePreview.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-4">
                  <Link to={`/profile/${u.id}`} className="flex min-w-0 items-center gap-3">
                    <img
                      src={u.profile_image || "/default-avatar.png"}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#12111A]">
                        {u.full_name}
                      </p>
                      <p className="truncate text-xs text-slate-500">@{u.username}</p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => (u.is_following ? unfollow(u.id) : follow(u.id))}
                    className={`
                      shrink-0 rounded-lg px-4 py-2
                      text-xs font-semibold
                      transition
                      ${
                        u.is_following
                          ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          : "bg-[#A855F7] text-white hover:bg-[#9333EA]"
                      }
                    `}
                  >
                    {u.is_following ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "people" && (
            <Pagination
              page={peoplePage}
              hasNext={peopleHasNext}
              hasPrevious={peopleHasPrevious}
              totalCount={peopleCount}
              onPageChange={setPeoplePage}
            />
          )}

          {activeTab === "all" && peopleList.length > 5 && (
            <button
              type="button"
              onClick={() => setActiveTab("people")}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              See all people
            </button>
          )}
        </div>
      )}

      {/* POSTS SECTION */}
      {showPosts && (
        <div className="mt-8">
          {activeTab === "all" && (
            <div className="mb-2 flex items-center gap-2">
              <FiGrid size={14} className="text-[#A855F7]" />
              <h2 className="text-sm font-bold text-[#12111A]">Posts</h2>
            </div>
          )}

          {postsLoading && (
            <p className="py-6 text-center text-sm text-slate-400">Searching posts...</p>
          )}

          {!postsLoading && postsPreview.length === 0 && (
            <p className="py-4 text-center text-xs text-slate-400">
              {debouncedSearch ? "No posts found." : "No public posts yet."}
            </p>
          )}

          {!postsLoading && postsPreview.length > 0 && (
            <div className="flex flex-col gap-4">
              {postsPreview.map((post) => (
                <ExplorePostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {activeTab === "posts" && (
            <Pagination
              page={postsPage}
              hasNext={postsHasNext}
              hasPrevious={postsHasPrevious}
              totalCount={postsCount}
              onPageChange={setPostsPage}
            />
          )}

          {activeTab === "all" && postsList.length > 5 && (
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              See all posts
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserExplore;
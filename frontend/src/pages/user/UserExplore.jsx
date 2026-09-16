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
    <div className="relative w-full min-w-0 bg-white overflow-x-hidden">
      {/* Subtle background glow, matches site theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-2xl xl:max-w-3xl px-3 sm:px-6 py-4 sm:py-8">

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
              w-full rounded-xl sm:rounded-2xl border border-slate-200
              py-3 sm:py-3.5 pl-10 pr-4
              text-sm
              outline-none
              transition
              focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            "
          />
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 rounded-lg sm:rounded-xl px-3 py-2
                text-xs sm:text-sm font-semibold
                transition
                ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
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
          <div className="mt-6 sm:mt-8">
            {activeTab === "all" && (
              <div className="mb-2 flex items-center gap-2">
                <FiUsers size={14} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">People</h2>
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
              <div className="divide-y divide-slate-100 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {peoplePreview.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 transition"
                  >
                    <Link to={`/profile/${u.id}`} className="flex min-w-0 items-center gap-3">
                      <img
                        src={u.profile_image || "/default-avatar.png"}
                        className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-100"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
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
                            ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                            : "bg-slate-900 text-white hover:bg-slate-700"
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
                className="mt-3 w-full rounded-xl sm:rounded-2xl border border-slate-200 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-blue-300"
              >
                See all people
              </button>
            )}
          </div>
        )}

        {/* POSTS SECTION */}
        {showPosts && (
          <div className="mt-8 sm:mt-10">
            {activeTab === "all" && (
              <div className="mb-2 flex items-center gap-2">
                <FiGrid size={14} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Posts</h2>
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
              <div className="flex flex-col gap-4 sm:gap-5">
                {postsPreview.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition min-w-0"
                  >
                    <ExplorePostCard post={post} />
                  </div>
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
                className="mt-3 w-full rounded-xl sm:rounded-2xl border border-slate-200 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-blue-300"
              >
                See all posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserExplore;
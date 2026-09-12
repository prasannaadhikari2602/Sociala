import { useState } from "react";
import { FiX, FiUserPlus, FiUserMinus } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../features/follows/followApi";

const FollowListPage = ({ type, userId, onClose }) => {
  const isFollowers = type === "followers";

  const {
    data: followersData,
    isLoading: followersLoading,
    isError: followersError,
  } = useGetFollowersQuery(userId, { skip: !isFollowers || !userId });

  const {
    data: followingData,
    isLoading: followingLoading,
    isError: followingError,
  } = useGetFollowingQuery(userId, { skip: isFollowers || !userId });

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  // Tracks which specific person's follow button is mid-request, so only
  // that row disables/shows a pending state instead of the whole list.
  const [pendingUserId, setPendingUserId] = useState(null);

  const isLoading = isFollowers ? followersLoading : followingLoading;
  const isError = isFollowers ? followersError : followingError;
  const rawList = isFollowers ? followersData : followingData;
  const list = Array.isArray(rawList)
    ? rawList
    : rawList?.results ?? rawList?.followers ?? rawList?.following ?? [];

  const handleToggleFollow = async (targetUser) => {
    if (pendingUserId) return;
    setPendingUserId(targetUser.id);
    try {
      if (targetUser.is_following) {
        await unfollowUser(targetUser.id).unwrap();
      } else {
        await followUser(targetUser.id).unwrap();
      }
    } catch (err) {
      console.error("Follow action failed:", err);
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex w-full max-w-md flex-col
          rounded-t-2xl sm:rounded-2xl
          bg-white
          shadow-xl
          max-h-[80vh]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-[#12111A] capitalize">
            {type}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-purple-200 border-t-[#A855F7]" />
            </div>
          )}

          {!isLoading && isError && (
            <p className="px-3 py-10 text-center text-sm text-red-500">
              Couldn't load {type}. Please try again.
            </p>
          )}

          {!isLoading && !isError && list.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-slate-500">
              No {type} yet.
            </p>
          )}

          {!isLoading &&
            !isError &&
            list.map((person) => {
              const isPending = pendingUserId === person.id;

              return (
                <div
                  key={person.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
                      {person.profile_image ? (
                        <img
                          src={person.profile_image}
                          alt={person.full_name || person.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-50 text-sm font-bold text-[#A855F7]">
                          {(person.full_name || person.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm font-semibold text-[#12111A]">
                          {person.full_name || person.username}
                        </p>
                        {person.is_verified && (
                          <MdVerified size={14} className="text-[#A855F7]" />
                        )}
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        @{person.username}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(person)}
                    disabled={isPending}
                    className={`
                      flex shrink-0 items-center gap-1.5
                      rounded-lg px-3 py-1.5
                      text-xs font-semibold
                      transition
                      disabled:opacity-60
                      ${
                        person.is_following
                          ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                          : "bg-[#A855F7] text-white hover:bg-[#9333EA]"
                      }
                    `}
                  >
                    {isPending ? (
                      "..."
                    ) : person.is_following ? (
                      <>
                        <FiUserMinus size={13} /> Unfollow
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={13} /> Follow
                      </>
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FollowListPage;
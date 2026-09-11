import { useState } from "react";
import { FiEdit2, FiMapPin, FiCalendar, FiList, FiGrid } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { useGetMyProfileQuery } from "../../features/profiles/profileApi";
import EditProfileModal from "./EditProfileModal";

const formatJoinDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const UserProfile = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [view, setView] = useState("list");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-500 text-sm">
        Loading profile...
      </div>
    );
  }

  if (isError || !data?.profile) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-500 text-sm">
        Couldn't load your profile. Please try again.
      </div>
    );
  }

  const profile = data.profile;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Cover */}
      <div
        className="relative h-56 w-full bg-linear-to-br from-blue-900 via-blue-700 to-slate-900"
        style={
          profile.cover_image
            ? {
                backgroundImage: `url(${profile.cover_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <button
          onClick={() => setIsEditOpen(true)}
          className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 backdrop-blur transition hover:bg-white"
        >
          <FiEdit2 size={16} />
          Edit Profile
        </button>
      </div>

      <div className="px-6 max-w-3xl mx-auto">
        {/* Avatar overlapping the cover */}
        <div className="-mt-16 w-32 h-32">
          <div className="w-32 h-32 rounded-full ring-4 ring-white overflow-hidden bg-slate-100 shadow-lg">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                {(profile.full_name || profile.username || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{profile.full_name}</h1>
            <MdVerified size={20} className="text-blue-600" />
          </div>
          <p className="text-slate-500">@{profile.username}</p>

          {profile.bio && <p className="mt-3 text-slate-700">{profile.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {profile.location && (
              <span className="flex items-center gap-1">
                <FiMapPin size={15} /> {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiCalendar size={15} /> Joined {formatJoinDate(profile.created_at)}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <span>
              <strong>{profile.posts_count ?? 0}</strong>{" "}
              <span className="text-slate-500">Posts</span>
            </span>
            <span>
              <strong>{profile.followers_count ?? 0}</strong>{" "}
              <span className="text-slate-500">Followers</span>
            </span>
            <span>
              <strong>{profile.following_count ?? 0}</strong>{" "}
              <span className="text-slate-500">Following</span>
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-semibold">Your Posts</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
              aria-label="List view"
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition ${
                view === "grid" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
              aria-label="Grid view"
            >
              <FiGrid size={18} />
            </button>
          </div>
        </div>

        <div className="py-6 text-slate-400 text-sm">No posts to show yet.</div>
      </div>

      {isEditOpen && (
        <EditProfileModal profile={profile} onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default UserProfile;
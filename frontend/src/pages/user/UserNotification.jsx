import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../../features/notifications/notificationApi";

const VERB_TEXT = {
  like: "liked your post",
  comment: "commented on your post",
  reply: "replied to your comment",
  follow: "started following you",
  share: "shared your post",
  report_warning: "",
};

const UserNotification = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Notifications</h1>
        <button onClick={() => markAllRead()} className="text-xs font-medium text-[#A855F7]">
          Mark all read
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {isLoading && <p className="py-6 text-center text-sm text-slate-400">Loading...</p>}

        {notifications?.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.is_read && markRead(n.id)}
            className={`flex items-start gap-3 py-4 ${!n.is_read ? "bg-purple-50/60" : ""}`}
          >
            {n.actor && (
              <img
                src={n.actor.profile_image || "/default-avatar.png"}
                className="h-9 w-9 rounded-full object-cover"
                alt=""
              />
            )}
            <div>
              <p className="text-sm">
                {n.actor && <span className="font-semibold">{n.actor.full_name} </span>}
                {n.message || VERB_TEXT[n.verb]}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {!isLoading && !notifications?.length && (
          <p className="py-10 text-center text-sm text-slate-400">You're all caught up.</p>
        )}
      </div>
    </div>
  );
};

export default UserNotification;
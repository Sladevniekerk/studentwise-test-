export default function NotificationBanner({ notifications, onDismiss }) {
  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-[320px]">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded-2xl shadow-lg border flex gap-3 ${
            n.type === "danger"
              ? "bg-red-50 border-red-200"
              : n.type === "warning"
              ? "bg-amber-50 border-amber-200"
              : "bg-emerald-50 border-emerald-200"
          }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{n.title}</p>
            <p className="text-xs text-gray-600 mt-1">{n.message}</p>
          </div>
          <button
            onClick={() => onDismiss(n.id)}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

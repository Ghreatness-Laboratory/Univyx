export default function NotificationBadge({ count = 3 }: { count?: number }) {
  return (
    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
      {count}
    </span>
  );
}

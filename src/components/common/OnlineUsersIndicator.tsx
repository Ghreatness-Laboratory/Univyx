import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function OnlineUsersIndicator() {
  const [count, setCount] = useState(127);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating online users
      setCount(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(100, Math.min(200, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-6 z-30 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-pulse">
      <div className="relative">
        <Users className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
      </div>
      <span className="text-sm font-bold">{count} online</span>
    </div>
  );
}

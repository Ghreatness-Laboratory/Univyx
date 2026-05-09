import { TrendingUp } from "lucide-react";

export default function TrendingBadge() {
  return (
    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-glow">
      <TrendingUp className="w-3 h-3" />
      <span>TRENDING</span>
    </div>
  );
}

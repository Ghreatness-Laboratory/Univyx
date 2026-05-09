import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, Trophy, MessageSquare, Heart, Share2 } from "lucide-react";

const activities = [
  { user: "Chioma A.", action: "completed", item: "Data Structures Course", time: "2 min ago", avatar: "CA", color: "bg-blue-500" },
  { user: "David O.", action: "joined", item: "Web Development Bootcamp", time: "5 min ago", avatar: "DO", color: "bg-purple-500" },
  { user: "Fatima I.", action: "earned", item: "Top Performer Badge", time: "12 min ago", avatar: "FI", color: "bg-green-500" },
  { user: "Emmanuel N.", action: "posted in", item: "Gaming Tournament", time: "18 min ago", avatar: "EN", color: "bg-orange-500" },
  { user: "Blessing A.", action: "liked", item: "Campus Event: Tech Meetup", time: "25 min ago", avatar: "BA", color: "bg-pink-500" },
  { user: "Michael E.", action: "commented on", item: "Study Group Discussion", time: "32 min ago", avatar: "ME", color: "bg-indigo-500" },
];

export default function LiveActivityFeed() {
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="font-semibold">2,847</span> online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium text-blue-600">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { 
  Gamepad2, 
  BookOpen, 
  PartyPopper, 
  Briefcase, 
  ShoppingBag, 
  Trophy, 
  Music, 
  Users, 
  Zap, 
  Star 
} from "lucide-react";

const features = [
  { icon: Gamepad2, text: "Esports Tournaments" },
  { icon: BookOpen, text: "Academic Resources" },
  { icon: PartyPopper, text: "Campus Events" },
  { icon: Briefcase, text: "Jobs & Internships" },
  { icon: ShoppingBag, text: "Student Store" },
  { icon: Trophy, text: "Leaderboards" },
  { icon: Music, text: "Entertainment Hub" },
  { icon: Users, text: "University Network" },
  { icon: Zap, text: "Live Updates" },
  { icon: Star, text: "Student Spotlight" },
];

export default function FeaturesMarquee() {
  const duplicatedFeatures = [...features, ...features];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-4 border-y border-blue-400/20">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-600 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-600 to-transparent z-10" />

      <div className="flex">
        <motion.div
          className="flex gap-8 pr-8"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-white whitespace-nowrap"
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="flex gap-8 pr-8"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={`duplicate-${index}`}
                className="flex items-center gap-2 text-white whitespace-nowrap"
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

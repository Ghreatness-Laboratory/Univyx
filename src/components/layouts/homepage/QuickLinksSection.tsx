import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Gamepad2, 
  BookOpen, 
  ShoppingBag, 
  Briefcase, 
  PartyPopper, 
  ArrowRight 
} from "lucide-react";

const quickLinks = [
  {
    title: "Gaming",
    description: "Join tournaments & compete",
    icon: Gamepad2,
    href: "/gaming",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    title: "Academics",
    description: "Access study resources",
    icon: BookOpen,
    href: "/academics",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    title: "Store",
    description: "Shop student essentials",
    icon: ShoppingBag,
    href: "/store",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    title: "Jobs",
    description: "Find internships & careers",
    icon: Briefcase,
    href: "/jobs",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    title: "Entertainment",
    description: "Explore events & articles",
    icon: PartyPopper,
    href: "/entertainment",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
  },
];

export default function QuickLinksSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explore Everything Univyx
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your all-in-one platform for campus life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={link.href}
                  className="group block relative overflow-hidden rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.bgGradient} transition-opacity duration-300`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${link.gradient} mb-4 w-fit`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {link.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {link.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

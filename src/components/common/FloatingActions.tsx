import { MessageCircle, Plus, X, Edit3, Gamepad2, Briefcase, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Edit3, label: "Write Article", href: "/entertainment", color: "bg-blue-500" },
    { icon: Gamepad2, label: "Join Tournament", href: "/gaming", color: "bg-purple-500" },
    { icon: Briefcase, label: "Find Jobs", href: "/jobs", color: "bg-green-500" },
    { icon: ShoppingBag, label: "Shop Now", href: "/store", color: "bg-pink-500" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className={`${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center gap-2 animate-float`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent size={20} />
                <span className="text-sm font-semibold whitespace-nowrap">{action.label}</span>
              </Link>
            );
          })}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse-glow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}

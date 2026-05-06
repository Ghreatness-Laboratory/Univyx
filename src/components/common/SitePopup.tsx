import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function SitePopup() {
  const [popup, setPopup] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const r = await api.getPopups();
        const popups = r.data?.data || [];
        if (popups.length === 0) return;
        const p = popups[0];

        const dismissed = sessionStorage.getItem(`popup_dismissed_${p.id}`);
        if (dismissed) return;

        setPopup(p);

        if (p.trigger === "onload") {
          setTimeout(() => setVisible(true), (p.delay_seconds || 0) * 1000);
        } else if (p.trigger === "timed") {
          setTimeout(() => setVisible(true), (p.delay_seconds || 5) * 1000);
        } else if (p.trigger === "scroll") {
          const handler = () => {
            if (window.scrollY > window.innerHeight * 0.4) {
              setVisible(true);
              window.removeEventListener("scroll", handler);
            }
          };
          window.addEventListener("scroll", handler);
          return () => window.removeEventListener("scroll", handler);
        } else if (p.trigger === "exit") {
          const handler = (e: MouseEvent) => {
            if (e.clientY <= 0) { setVisible(true); document.removeEventListener("mouseleave", handler); }
          };
          document.addEventListener("mouseleave", handler);
          return () => document.removeEventListener("mouseleave", handler);
        }
      } catch {}
    };
    fetchPopup();
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (popup) sessionStorage.setItem(`popup_dismissed_${popup.id}`, "1");
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) dismiss(); }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {popup.image && (
              <div className="relative h-48">
                <img src={popup.image} alt={popup.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{popup.title}</h3>
                <button onClick={dismiss} className="p-1 hover:bg-gray-100 rounded-lg ml-2 shrink-0">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              {popup.content && <p className="text-gray-600 mb-5 leading-relaxed">{popup.content}</p>}
              <div className="flex gap-3">
                {popup.cta_text && popup.cta_link && (
                  <Link
                    to={popup.cta_link}
                    onClick={dismiss}
                    className="flex-1 text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    {popup.cta_text}
                  </Link>
                )}
                <button onClick={dismiss} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

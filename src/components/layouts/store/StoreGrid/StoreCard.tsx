"use client";

import { motion } from "framer-motion";
import { Star, Shield, Award, MapPin, MessageCircle } from "lucide-react";

interface StoreCardProps {
  store: any;
  onClick: () => void;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  const rating = Number(store.rating || 0);
  const stars = Math.round(rating);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="min-w-[280px] rounded-2xl overflow-hidden shadow-md bg-white border border-primary/10 transition-all relative flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={store.logo?.startsWith("http") ? store.logo : "/placeholder-store.jpg"}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Verified badge */}
        {store.is_verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <Shield size={10} />
            Verified
          </div>
        )}

        {/* University badge */}
        {store.university && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <MapPin size={10} />
            {store.university}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Name & rating */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-primary leading-tight">{store.name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < stars ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({store.reviews_count || 0})</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-secondary leading-6 text-sm line-clamp-2">{store.description}</p>

        {/* Achievements */}
        {store.achievements?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {store.achievements.slice(0, 3).map((ach: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                <Award size={10} />
                {ach}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {store.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {store.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* Social links */}
        <div className="flex flex-wrap gap-2">
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-colors">WhatsApp</a>
          )}
          {store.instagram && (
            <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full hover:bg-pink-200 transition-colors">Instagram</a>
          )}
          {store.twitter && (
            <a href={store.twitter} target="_blank" rel="noopener noreferrer" className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full hover:bg-sky-200 transition-colors">Twitter</a>
          )}
          {store.facebook && (
            <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors">Facebook</a>
          )}
        </div>

        {/* CTA */}
        {store.whatsapp && (
          <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClick}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-sm text-white rounded-full px-4 py-2.5 font-medium transition-colors"
            >
              <MessageCircle size={14} />
              Contact Store
            </motion.button>
          </a>
        )}
      </div>
    </motion.div>
  );
}

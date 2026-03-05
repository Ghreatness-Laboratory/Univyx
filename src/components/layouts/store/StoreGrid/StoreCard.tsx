"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { StoreData } from "../../../../types/store";
import { getImageUrl } from "../../../../utils/imageUrl";

interface StoreCardProps {
  store: StoreData;
  onClick: () => void;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden shadow-md bg-white border border-primary/10 transition-all relative"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={store.logo?.startsWith('http') ? store.logo : `https://univyx-backend-1xfv.onrender.com${store.logo}` || '/placeholder-image.jpg'}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="p-5 space-y-5 min-h-[168px] flex flex-col">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-primary">{store.name}</h3>
          </div>
          <p className="text-secondary leading-6 text-sm line-clamp-2">
            {store.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">WhatsApp</a>
          )}
          {store.instagram && (
            <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Instagram</a>
          )}
          {store.twitter && (
            <a href={store.twitter} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Twitter</a>
          )}
          {store.facebook && (
            <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Facebook</a>
          )}
        </div>

        {store.whatsapp && (
          <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-fit mt-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClick}
              className="bg-indigo-500 text-sm text-white rounded-full px-4 py-2.5 font-medium"
            >
              <span>Contact Store</span>
            </motion.button>
          </a>
        )}
      </div>
    </motion.div>
  );
}

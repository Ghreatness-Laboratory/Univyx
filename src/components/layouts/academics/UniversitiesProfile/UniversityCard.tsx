import { motion } from "framer-motion";
import { University } from "../../../../types/api";

interface UniversityCardProps {
  university: University;
  onClick: () => void;
}

export default function UniversityCard({
  university,
  onClick,
}: UniversityCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden shadow-lg bg-white border border-primary/10 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={university.logo_url || university.logo || '/placeholder-university.jpg'}
          alt={university.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5 space-y-3 min-h-[168px] flex flex-col">
        <div>
          <h3 className="text-lg font-bold text-primary mb-1 ">
            {university.name}
          </h3>
          <p className="text-secondary text-sm">{university.location}</p>
        </div>
        <div className="flex justify-between items-center flex-1">
          <span className="text-sm text-secondary space-x-3">
            {university.established_year ? `Est. ${university.established_year}` : 'University'}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="bg-primary text-sm text-white rounded-full px-3 py-2 hover:bg-primary/90 transition-colors"
          >
            See More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

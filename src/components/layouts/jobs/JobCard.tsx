import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Shield, ExternalLink, GraduationCap } from "lucide-react";

interface JobCardProps {
  job: any;
  onApply: (job: any) => void;
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  job: { label: "Full-time Job", color: "bg-blue-100 text-blue-700", icon: Briefcase },
  siwes: { label: "SIWES", color: "bg-green-100 text-green-700", icon: GraduationCap },
  nysc: { label: "NYSC", color: "bg-purple-100 text-purple-700", icon: GraduationCap },
  internship: { label: "Internship", color: "bg-orange-100 text-orange-700", icon: Briefcase },
};

export default function JobCard({ job, onApply }: JobCardProps) {
  const type = typeConfig[job.type] || typeConfig.job;
  const Icon = type.icon;

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    if (job.salary_min && job.salary_max) return `₦${job.salary_min.toLocaleString()} – ₦${job.salary_max.toLocaleString()}`;
    if (job.salary_min) return `From ₦${job.salary_min.toLocaleString()}`;
    return `Up to ₦${job.salary_max.toLocaleString()}`;
  };

  const salary = formatSalary();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {job.image ? (
            <img src={job.image} alt={job.company} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Icon size={22} className="text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>
        {job.is_verified && (
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full whitespace-nowrap">
            <Shield size={10} />
            Verified
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${type.color}`}>
          <Icon size={10} />
          {type.label}
        </span>
        {job.is_remote && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700">Remote</span>
        )}
        {job.location && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 px-2.5 py-1 rounded-full bg-gray-100">
            <MapPin size={10} />
            {job.location}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{job.description}</p>

      {/* Salary & deadline */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {salary && (
          <span className="font-semibold text-green-600 text-sm">{salary}</span>
        )}
        {job.deadline && (
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Pay record badge */}
      {job.salary_verified && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <Shield size={14} className="text-green-600" />
          <span className="text-xs text-green-700 font-medium">Pay record verified — employer has proven payment history</span>
        </div>
      )}

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 4).map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        <button
          onClick={() => onApply(job)}
          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          Apply Now
        </button>
        {job.application_url && (
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={16} className="text-gray-500" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

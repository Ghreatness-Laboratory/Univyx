import { useState, useEffect } from "react";
import { Search, Filter, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "job", label: "Full-time Jobs" },
  { value: "siwes", label: "SIWES" },
  { value: "nysc", label: "NYSC" },
  { value: "internship", label: "Internships" },
];

export default function JobsGrid() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("");
  const [applyJob, setApplyJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [activeType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.getJobs({ type: activeType || undefined });
      const data = response.data?.data || [];
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(j =>
    !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async () => {
    if (!isAuthenticated) { window.location.href = "/login"; return; }
    try {
      setApplying(true);
      await api.applyToJob(applyJob.id, coverLetter);
      setApplySuccess(true);
      setTimeout(() => { setApplyJob(null); setApplySuccess(false); setCoverLetter(""); }, 2000);
    } catch (err: any) {
      alert(err?.message || "Failed to apply. You may have already applied.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <section id="jobs-grid" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {JOB_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setActiveType(t.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeType === t.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Filter size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No opportunities found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onApply={setApplyJob} />
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {applyJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setApplyJob(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              {applySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                  <p className="text-gray-500">Your application for <strong>{applyJob.title}</strong> has been submitted.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Apply for {applyJob.title}</h3>
                      <p className="text-gray-500 text-sm">{applyJob.company}</p>
                    </div>
                    <button onClick={() => setApplyJob(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (optional)</label>
                    <textarea
                      rows={5}
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      placeholder="Tell the employer why you're a great fit..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  {applyJob.application_email && (
                    <p className="text-xs text-gray-500 mb-4">You can also email directly: <a href={`mailto:${applyJob.application_email}`} className="text-blue-600">{applyJob.application_email}</a></p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>
                    <button onClick={() => setApplyJob(null)} className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

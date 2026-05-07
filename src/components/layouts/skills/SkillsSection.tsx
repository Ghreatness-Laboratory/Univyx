import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Search, Plus, X, ExternalLink } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const SKILL_CATEGORIES = ["All", "Design", "Development", "Writing", "Marketing", "Photography", "Video", "Music", "Tutoring", "Other"];

function SkillCard({ skill }: { skill: any }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {skill.image && (
        <div className="h-40 overflow-hidden">
          <img src={skill.image} alt={skill.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">{skill.category}</span>
          {skill.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <Star size={12} fill="currentColor" />
              {Number(skill.rating).toFixed(1)} ({skill.reviews_count})
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mt-2 mb-1">{skill.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{skill.description}</p>
        {skill.university && <p className="text-xs text-gray-400 mb-3">📍 {skill.university}</p>}
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">
            {skill.is_free ? <span className="text-green-600">Free</span> : skill.price ? `₦${Number(skill.price).toLocaleString()}` : "Contact"}
          </span>
          {skill.portfolio_url && (
            <a href={skill.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              Portfolio <ExternalLink size={11} />
            </a>
          )}
        </div>
        {skill.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {skill.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ListSkillModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Design", price: "", is_free: false, portfolio_url: "", university: "", tags: "" });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v.toString()));
      if (image) data.append("image", image);
      await api.createSkill(data);
      onSuccess();
    } catch (err) {
      console.error("Failed to list skill:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">List Your Skill</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Skill title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <textarea required rows={3} placeholder="Describe your skill..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {SKILL_CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Your university" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-3">
            <input type="number" placeholder="Price (₦)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} disabled={form.is_free} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.is_free} onChange={e => setForm({ ...form, is_free: e.target.checked })} className="rounded" />
              Free
            </label>
          </div>
          <input placeholder="Portfolio URL (optional)" value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50">
            {loading ? "Listing..." : "List Skill"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { isAuthenticated } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchSkills(); }, [activeCategory]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.getSkills({ category: activeCategory !== "All" ? activeCategory : undefined });
      setSkills(response.data?.data || []);
    } catch (err) {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = skills.filter(s => !search || s.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Student Skills Marketplace</h2>
          <p className="text-gray-500 mt-1">Hire talented students or list your own skills</p>
        </div>
        <button
          onClick={() => isAuthenticated ? setShowModal(true) : window.location.href = "/login"}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus size={18} />
          List Your Skill
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SKILL_CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === c ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No skills listed yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(skill => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      )}

      {showModal && (
        <ListSkillModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchSkills(); }}
        />
      )}
    </section>
  );
}

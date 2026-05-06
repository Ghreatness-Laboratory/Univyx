import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Briefcase } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

const JOB_TYPES = ['job', 'siwes', 'nysc', 'internship'];

const emptyForm = {
  title: '', company: '', description: '', requirements: '', type: 'job',
  location: '', is_remote: false, salary_min: '', salary_max: '',
  salary_verified: false, pay_record: '', application_url: '',
  application_email: '', deadline: '', is_verified: false, tags: ''
};

export default function JobManager() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.getJobs();
      setJobs(response.data?.data || []);
    } catch { setJobs([]); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v.toString()));
      if (image) data.append('image', image);
      if (editingId) await api.updateJob(editingId, data);
      else await api.createJob(data);
      reset(); fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to save job');
    } finally { setLoading(false); }
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setForm({
      title: job.title || '', company: job.company || '', description: job.description || '',
      requirements: job.requirements || '', type: job.type || 'job', location: job.location || '',
      is_remote: job.is_remote || false, salary_min: job.salary_min || '',
      salary_max: job.salary_max || '', salary_verified: job.salary_verified || false,
      pay_record: job.pay_record || '', application_url: job.application_url || '',
      application_email: job.application_email || '', deadline: job.deadline ? job.deadline.split('T')[0] : '',
      is_verified: job.is_verified || false, tags: job.tags?.join(', ') || ''
    });
    setImagePreview(job.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try { await api.deleteJob(id); fetchJobs(); } catch {}
  };

  const reset = () => { setForm(emptyForm); setImage(null); setImagePreview(''); setEditingId(null); setShowForm(false); };

  const f = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Job & Placement Manager</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />{showForm ? 'Cancel' : 'Add Opportunity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging}
            onImageChange={f => { setImage(f); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(f); }}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging} label="Company Logo / Job Image" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input required value={form.title} onChange={e => f('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input required value={form.company} onChange={e => f('company', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select required value={form.type} onChange={e => f('type', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                {JOB_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => f('location', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={4} value={form.description} onChange={e => f('description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea rows={3} value={form.requirements} onChange={e => f('requirements', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₦)</label>
              <input type="number" value={form.salary_min} onChange={e => f('salary_min', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₦)</label>
              <input type="number" value={form.salary_max} onChange={e => f('salary_max', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => f('deadline', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
              <input type="url" value={form.application_url} onChange={e => f('application_url', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Email</label>
              <input type="email" value={form.application_email} onChange={e => f('application_email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Record / Proof</label>
            <input placeholder="e.g. Verified by CivilProviding — 3 years consistent payment" value={form.pay_record} onChange={e => f('pay_record', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input placeholder="e.g. tech, remote, entry-level" value={form.tags} onChange={e => f('tags', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_remote} onChange={e => f('is_remote', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Remote</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.salary_verified} onChange={e => f('salary_verified', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Pay Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_verified} onChange={e => f('is_verified', e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Employer Verified</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={reset} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No jobs listed yet. Add your first opportunity!</p>
          </div>
        ) : jobs.map(job => (
          <div key={job.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {job.image && <img src={job.image} alt={job.company} className="w-14 h-14 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{job.type?.toUpperCase()}</span>
                {job.is_verified && <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><Shield size={10} />Verified</span>}
              </div>
              <p className="text-sm text-gray-500">{job.company} {job.location && `· ${job.location}`}</p>
              {job.salary_min && <p className="text-sm text-green-600 font-medium mt-1">₦{Number(job.salary_min).toLocaleString()} – ₦{Number(job.salary_max).toLocaleString()}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

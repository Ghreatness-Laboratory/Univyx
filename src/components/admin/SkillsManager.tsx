import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Clock } from 'lucide-react';
import supabaseDb from '../../services/supabase-db';
import ImageUpload from '../common/ImageUpload';

export default function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    level: 'Beginner',
    duration: '',
    instructor: '',
    price: 0,
    is_active: true
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await supabaseDb.getSkills();
      setSkills(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = imagePreview;
      if (image) {
        const fileName = `skills/${Date.now()}-${image.name}`;
        imageUrl = await supabaseDb.uploadFile('images', fileName, image);
      }
      const data = { ...formData, image: imageUrl };
      if (editingId) {
        await supabaseDb.updateSkill(editingId, data);
      } else {
        await supabaseDb.createSkill(data);
      }
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Failed to save skill:', error);
      alert('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      duration: skill.duration,
      instructor: skill.instructor,
      price: skill.price,
      is_active: skill.is_active
    });
    setImagePreview(skill.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await supabaseDb.deleteSkill(id);
      fetchSkills();
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      level: 'Beginner',
      duration: '',
      instructor: '',
      price: 0,
      is_active: true
    });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skills & Courses</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload image={image} imagePreview={imagePreview} isDragging={isDragging} onImageChange={handleImageChange} onRemove={() => { setImage(null); setImagePreview(''); }} onDragStateChange={setIsDragging} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
              <input type="text" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="Technical">Technical</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 4 weeks" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-teal-600 rounded" />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {skill.image && <img src={skill.image} alt={skill.title} className="w-24 h-24 object-cover rounded-lg" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{skill.title}</h3>
                <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">{skill.category}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{skill.level}</span>
                {!skill.is_active && <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Inactive</span>}
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{skill.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {skill.duration && <span className="flex items-center gap-1"><Clock size={14} />{skill.duration}</span>}
                {skill.instructor && <span className="flex items-center gap-1"><Award size={14} />{skill.instructor}</span>}
                {skill.price > 0 && <span className="font-semibold text-teal-600">${skill.price}</span>}
                {skill.price === 0 && <span className="font-semibold text-green-600">Free</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(skill)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

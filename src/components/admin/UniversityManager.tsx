import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GraduationCap, MapPin, Calendar, Globe, Building2 } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';
import { University } from '../../types/api';

export default function UniversityManager() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    website: '',
    location: '',
    description: '',
    established_year: new Date().getFullYear()
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await api.getUniversities();
      const data = response.data.data || response.data || [];
      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      setUniversities([]);
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
      const data = new FormData();
      data.append('name', formData.name);
      data.append('abbreviation', formData.abbreviation);
      data.append('website', formData.website);
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('established_year', formData.established_year.toString());
      if (image) data.append('logo', image);

      if (editingId) {
        await api.updateUniversity(editingId, data);
      } else {
        await api.createUniversity(data as any);
      }

      resetForm();
      fetchUniversities();
    } catch (error: any) {
      console.error('Failed to save university:', error);
      alert(error.response?.data?.message || 'Failed to save university');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (university: University) => {
    setEditingId(university.id!);
    setFormData({
      name: university.name,
      abbreviation: university.abbreviation || '',
      website: university.website || '',
      location: university.location || '',
      description: university.description || '',
      established_year: university.established_year || new Date().getFullYear()
    });
    setImagePreview(university.logo || university.logo_url || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this university? This action cannot be undone.')) return;
    try {
      await api.deleteUniversity(id);
      fetchUniversities();
    } catch (error) {
      console.error('Failed to delete university:', error);
      alert('Failed to delete university');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      abbreviation: '',
      website: '',
      location: '',
      description: '',
      established_year: new Date().getFullYear()
    });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Universities</h2>
          <p className="text-sm text-gray-500 mt-1">Manage university profiles and information</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add University'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg space-y-4 border border-indigo-200">
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., University of Lagos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abbreviation</label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., UNILAG"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Lagos, Nigeria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.established_year}
                onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Brief description about the university..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : editingId ? 'Update University' : 'Create University'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {universities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No universities yet. Add your first one!</p>
          </div>
        ) : (
          universities.map((university) => (
            <div key={university.id} className="flex gap-4 p-5 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
              {(university.logo || university.logo_url) && (
                <div className="flex-shrink-0">
                  <img 
                    src={university.logo || university.logo_url} 
                    alt={university.name} 
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200 p-2 bg-white" 
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2 flex-wrap">
                  <GraduationCap size={22} className="text-indigo-600 flex-shrink-0" />
                  <span className="truncate">{university.name}</span>
                  {university.abbreviation && (
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">({university.abbreviation})</span>
                  )}
                </h3>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {university.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {university.location}
                    </span>
                  )}
                  {university.established_year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      Est. {university.established_year}
                    </span>
                  )}
                  {university.website && (
                    <a 
                      href={university.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                    >
                      <Globe size={14} />
                      Website
                    </a>
                  )}
                </div>
                
                {university.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{university.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleEdit(university)} 
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit university"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(university.id!)} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete university"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
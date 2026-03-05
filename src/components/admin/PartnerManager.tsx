import { useState, useEffect } from 'react';
import { Plus, Trash2, Handshake } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

export default function PartnerManager() {
  const [partners, setPartners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', website: '', order: 0 });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await api.getPartners();
      const data = response.data.data || response.data || [];
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setPartners([]);
    }
  };

  const handleLogoChange = (file: File) => {
    setLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('website', formData.website);
      data.append('order', formData.order.toString());
      if (logo) data.append('logo', logo);

      await api.createPartner(data);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Failed to save partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await api.deletePartner(id);
      fetchPartners();
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', website: '', order: 0 });
    setLogo(null);
    setLogoPreview('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
          <p className="text-sm text-gray-500 mt-1">Manage homepage partners/sponsors</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Partner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg space-y-4 border border-purple-200">
          <ImageUpload
            image={logo}
            imagePreview={logoPreview}
            isDragging={isDragging}
            onImageChange={handleLogoChange}
            onRemove={() => { setLogo(null); setLogoPreview(''); }}
            onDragStateChange={setIsDragging}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Add Partner'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div key={partner._id} className="relative p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group">
            {partner.logo && <img src={partner.logo} alt={partner.name} className="w-full h-24 object-contain mb-2" />}
            <p className="text-sm font-medium text-gray-900 text-center">{partner.name}</p>
            <button
              onClick={() => handleDelete(partner._id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

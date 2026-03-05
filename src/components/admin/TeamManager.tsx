import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

export default function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', order: 0, social: { twitter: '', linkedin: '', github: '' } });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.getTeamMembers();
      const data = response.data.data || response.data || [];
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setMembers([]);
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
      data.append('role', formData.role);
      data.append('bio', formData.bio);
      data.append('order', formData.order.toString());
      data.append('social', JSON.stringify(formData.social));
      if (image) data.append('image', image);

      if (editingId) {
        await api.updateTeamMember(editingId, data);
      } else {
        await api.createTeamMember(data);
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Failed to save team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      order: member.order || 0,
      social: member.social || { twitter: '', linkedin: '', github: '' }
    });
    setImagePreview(member.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await api.deleteTeamMember(id);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', order: 0, social: { twitter: '', linkedin: '', github: '' } });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-1">Manage homepage team section</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg space-y-4 border border-blue-200">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="text"
                value={formData.social.twitter}
                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="text"
                value={formData.social.linkedin}
                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
              <input
                type="text"
                value={formData.social.github}
                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, github: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : editingId ? 'Update Member' : 'Create Member'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div key={member._id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            {member.image && <img src={member.image} alt={member.name} className="w-20 h-20 object-cover rounded-full" />}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
              <p className="text-sm text-blue-600">{member.role}</p>
              {member.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{member.bio}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(member._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

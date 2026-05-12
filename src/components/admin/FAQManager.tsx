import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { supabase } from '../../services/supabase-client';

export default function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '', category: '', order: 0 });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order');
      
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      setFaqs([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        alert('FAQ updated successfully!');
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([formData]);
        
        if (error) throw error;
        alert('FAQ created successfully!');
      }

      resetForm();
      fetchFAQs();
    } catch (error: any) {
      console.error('Failed to save FAQ:', error);
      alert('Failed to save FAQ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      order: faq.order || 0
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('FAQ deleted successfully!');
      fetchFAQs();
    } catch (error: any) {
      console.error('Failed to delete FAQ:', error);
      alert('Failed to delete FAQ: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: '', order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
          <p className="text-sm text-gray-500 mt-1">Manage homepage frequently asked questions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg space-y-4 border border-teal-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  <HelpCircle size={18} className="text-teal-600" />
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                {faq.category && <span className="inline-block mt-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">{faq.category}</span>}
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleEdit(faq)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

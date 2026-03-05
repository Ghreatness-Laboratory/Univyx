import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Store as StoreIcon, Package } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';

type Tab = 'stores' | 'items';

export default function StoreManager() {
  const [activeTab, setActiveTab] = useState<Tab>('stores');
  const [stores, setStores] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [storeForm, setStoreForm] = useState({ name: '', description: '', whatsapp: '', instagram: '', twitter: '', facebook: '' });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: 0, category: '', store: '', in_stock: true });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchItems();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await api.getStores();
      const data = response.data.data || response.data || [];
      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setStores([]);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.getStoreItems();
      const data = response.data.data || response.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(storeForm).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('logo', image);

      if (editingId) {
        await api.updateStore(editingId, data);
      } else {
        await api.createStore(data);
      }

      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Failed to save store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(itemForm).forEach(([key, value]) => data.append(key, value.toString()));
      if (image) data.append('image', image);

      if (editingId) {
        await api.updateStoreItem(editingId, data);
      } else {
        await api.createStoreItem(data as any);
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStore = (store: any) => {
    setActiveTab('stores');
    setEditingId(store.id);
    setStoreForm({
      name: store.name || '',
      description: store.description || '',
      whatsapp: store.whatsapp || '',
      instagram: store.instagram || '',
      twitter: store.twitter || '',
      facebook: store.facebook || ''
    });
    setImagePreview(store.logo || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditItem = (item: any) => {
    setActiveTab('items');
    setEditingId(item.id);
    setItemForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      category: item.category || '',
      store: item.store || '',
      in_stock: item.in_stock !== false
    });
    setImagePreview(item.image || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Delete this store?')) return;
    try {
      await api.deleteStore(id);
      fetchStores();
    } catch (error) {
      console.error('Failed to delete store:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.deleteStoreItem(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const resetForm = () => {
    setStoreForm({ name: '', description: '', whatsapp: '', instagram: '', twitter: '', facebook: '' });
    setItemForm({ name: '', description: '', price: 0, category: '', store: '', in_stock: true });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Store Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : `Add ${activeTab === 'stores' ? 'Store' : 'Item'}`}
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('stores'); resetForm(); }}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'stores' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <StoreIcon size={18} />
          Stores
        </button>
        <button
          onClick={() => { setActiveTab('items'); resetForm(); }}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'items' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package size={18} />
          Items
        </button>
      </div>

      {showForm && activeTab === 'stores' && (
        <form onSubmit={handleStoreSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging}
            label="Store Logo"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              required
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={storeForm.description}
              onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                value={storeForm.whatsapp}
                onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                value={storeForm.instagram}
                onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="text"
                value={storeForm.twitter}
                onChange={(e) => setStoreForm({ ...storeForm, twitter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                value={storeForm.facebook}
                onChange={(e) => setStoreForm({ ...storeForm, facebook: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {showForm && activeTab === 'items' && (
        <form onSubmit={handleItemSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <ImageUpload
            image={image}
            imagePreview={imagePreview}
            isDragging={isDragging}
            onImageChange={handleImageChange}
            onRemove={() => { setImage(null); setImagePreview(''); }}
            onDragStateChange={setIsDragging}
            label="Item Image"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                required
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
              <select
                required
                value={itemForm.store}
                onChange={(e) => setItemForm({ ...itemForm, store: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                required
                step="0.01"
                value={itemForm.price || ''}
                onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                required
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">In Stock</label>
              <select
                value={itemForm.in_stock.toString()}
                onChange={(e) => setItemForm({ ...itemForm, in_stock: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              {store.logo && <img src={`https://univyx-backend-1xfv.onrender.com${store.logo}`} alt={store.name} className="w-16 h-16 object-cover rounded-lg" />}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{store.description}</p>
                <div className="flex gap-2 mt-2">
                  {store.whatsapp && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">WhatsApp</span>}
                  {store.instagram && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Instagram</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEditStore(store)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDeleteStore(store.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-600 font-semibold">${item.price}</span>
                  <span className={`text-xs px-2 py-1 rounded ${item.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEditItem(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

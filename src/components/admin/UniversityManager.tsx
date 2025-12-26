import { useState } from 'react';
import { Plus, Edit, Trash2, School } from 'lucide-react';
import { useUniversities } from '../../hooks/useAcademics';
import { University } from '../../types/api';
import UniversityForm from './forms/UniversityForm';
import apiService from '../../services/api';

export default function UniversityManager() {
  const { universities, loading, error, refetch } = useUniversities();
  const [showForm, setShowForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // API call would go here - endpoint not implemented in service yet
      console.log('Deleting university:', id);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUniversity(null);
    refetch();
  };

  if (loading) return <div className="text-center py-8">Loading universities...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">University Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New University
          </button>
        </div>
      </div>

      <div className="p-6">
        {universities.length === 0 ? (
          <div className="text-center py-12">
            <School size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No universities found</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Add your first university
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <div key={university.id} className="border border-gray-200 rounded-lg p-4">
                {university.logo && (
                  <img
                    src={university.logo}
                    alt={university.name}
                    className="w-16 h-16 object-contain mx-auto mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-900 text-center mb-2">{university.name}</h3>
                {university.abbreviation && (
                  <p className="text-sm text-gray-500 text-center mb-2">({university.abbreviation})</p>
                )}
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{university.description}</p>
                <div className="text-sm text-gray-500 mb-3">
                  <p>{university.location}</p>
                  {university.established_year && (
                    <p>Est. {university.established_year}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(university)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingId(university.id!)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <UniversityForm
          university={editingUniversity}
          onClose={handleFormClose}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete University</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this university?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
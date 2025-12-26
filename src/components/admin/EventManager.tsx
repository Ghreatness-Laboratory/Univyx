import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useEvents } from '../../hooks/useEntertainment';
import { Event } from '../../types/api';
import EventForm from './forms/EventForm';
import apiService from '../../services/api';

export default function EventManager() {
  const { events, loading, error, refetch } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteEventById(id);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    refetch();
  };

  if (loading) return <div className="text-center py-8">Loading events...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Event Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No events found</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-orange-600 hover:text-orange-700"
            >
              Create your first event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(event.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{event.date}</span>
                  </div>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                  <span>{event.likes_count} likes</span>
                  <span>{event.comments_count} comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this event?</p>
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
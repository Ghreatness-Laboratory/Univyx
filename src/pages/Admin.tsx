import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, BookOpen, Trophy, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ArticleManager from '../components/admin/ArticleManager';
import EventManager from '../components/admin/EventManager';
import NewsManager from '../components/admin/NewsManager';
import StoreManager from '../components/admin/StoreManager';
import UniversityManager from '../components/admin/UniversityManager';
import TournamentManager from '../components/admin/TournamentManager';

type AdminSection = 'articles' | 'events' | 'news' | 'store' | 'universities' | 'tournaments';

const adminSections = [
  { id: 'articles' as AdminSection, label: 'Articles', icon: Edit, color: 'purple' },
  { id: 'events' as AdminSection, label: 'Events', icon: Plus, color: 'orange' },
  { id: 'news' as AdminSection, label: 'News', icon: BookOpen, color: 'blue' },
  { id: 'store' as AdminSection, label: 'Store', icon: Store, color: 'green' },
  { id: 'universities' as AdminSection, label: 'Universities', icon: Users, color: 'indigo' },
  { id: 'tournaments' as AdminSection, label: 'Tournaments', icon: Trophy, color: 'yellow' },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>('articles');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'articles': return <ArticleManager />;
      case 'events': return <EventManager />;
      case 'news': return <NewsManager />;
      case 'store': return <StoreManager />;
      case 'universities': return <UniversityManager />;
      case 'tournaments': return <TournamentManager />;
      default: return <ArticleManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content and settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
              <nav className="space-y-2">
                {adminSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? `bg-${section.color}-50 text-${section.color}-700 border-${section.color}-200`
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
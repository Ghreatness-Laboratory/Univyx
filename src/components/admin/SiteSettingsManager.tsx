import { useState, useEffect } from 'react';
import { Save, Settings, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const SECTION_LABELS: Record<string, string> = {
  hero: '🏠 Homepage Hero',
  jobs: '💼 Jobs Page',
  store: '🛍️ Store Page',
  entertainment: '🎭 Entertainment Page',
  gaming: '🎮 Gaming Page',
};

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<any[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const r = await api.getAllSiteSettings();
      const data = r.data?.data || [];
      setSettings(data);
      const vals: Record<string, string> = {};
      data.forEach((s: any) => { vals[s.key] = s.value || ''; });
      setValues(vals);
    } catch { setSettings([]); }
    finally { setLoading(false); }
  };

  const handleSave = async (key: string) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await api.updateSiteSetting(key, values[key]);
      setSaved(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 2000);
    } catch (err) { console.error(err); }
    finally { setSaving(prev => ({ ...prev, [key]: false })); }
  };

  const grouped = settings.reduce((acc: Record<string, any[]>, s: any) => {
    const section = s.section || 'general';
    if (!acc[section]) acc[section] = [];
    acc[section].push(s);
    return acc;
  }, {});

  if (loading) return <div className="bg-white rounded-lg p-6 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Settings size={24} />Site Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Edit all text content across the website</p>
        </div>
        <button onClick={fetchSettings} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
          <RefreshCw size={16} />Refresh
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([section, sectionSettings]) => (
          <div key={section}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {SECTION_LABELS[section] || section}
            </h3>
            <div className="space-y-4">
              {(sectionSettings as any[]).map((setting: any) => (
                <div key={setting.key} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{setting.label || setting.key}</label>
                    {setting.value?.length > 80 ? (
                      <textarea
                        rows={3}
                        value={values[setting.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[setting.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleSave(setting.key)}
                    disabled={saving[setting.key]}
                    className={`mt-6 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      saved[setting.key] ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } disabled:opacity-50`}
                  >
                    <Save size={14} />
                    {saving[setting.key] ? 'Saving...' : saved[setting.key] ? 'Saved!' : 'Save'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

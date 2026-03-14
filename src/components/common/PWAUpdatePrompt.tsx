import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every hour
      r && setInterval(() => r.update(), 60 * 60 * 1000);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:top-6 md:w-80 z-[9999] animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-white" />
            <p className="text-white font-semibold text-sm">Update Available</p>
          </div>
          <button
            onClick={() => setNeedRefresh(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="text-gray-600 text-xs mb-3">
            A new version of Univyx is ready. Reload to get the latest features.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
            >
              Reload Now
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

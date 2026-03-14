import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for install prompt (Chrome/Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after 3 seconds delay for better UX
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS prompt after delay if not dismissed
    if (ios) {
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) setShowPrompt(true);
      }, 3000);
    }

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[9999] animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/icon-72x72.png" alt="Univyx" className="w-10 h-10 rounded-xl" />
            <div>
              <p className="text-white font-bold text-sm">Install Univyx</p>
              <p className="text-purple-200 text-xs">Student Platform</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-gray-700 text-sm mb-4">
            Install Univyx for a faster, app-like experience — works offline too!
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { icon: '⚡', text: 'Faster loading' },
              { icon: '📴', text: 'Works offline' },
              { icon: '🔔', text: 'Notifications' },
              { icon: '📱', text: 'App-like feel' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-xs text-gray-600">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {isIOS ? (
            /* iOS Instructions */
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-800">
              <p className="font-semibold mb-2 flex items-center gap-1">
                <Smartphone size={14} /> Install on iOS:
              </p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Tap the <strong>Share</strong> button in Safari</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
              </ol>
            </div>
          ) : (
            /* Chrome/Android/Desktop Install Button */
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-200 disabled:opacity-70"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Install App
                </>
              )}
            </button>
          )}

          <p className="text-center text-xs text-gray-400 mt-3">
            Free • No app store required
          </p>
        </div>
      </div>
    </div>
  );
}

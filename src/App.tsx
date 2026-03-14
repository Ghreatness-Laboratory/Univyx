import { useEffect } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/layouts/common/Footer";
import Navbar from "./components/layouts/common/Navbar";
import ArticlesModal from "./components/modals/entertainment/articles";
import NewsModal from "./components/modals/entertainment/news";
import TopicsModal from "./components/modals/entertainment/topics";
import { startKeepAlive, stopKeepAlive } from "./services/keepAlive";
import PWAInstallPrompt from "./components/common/PWAInstallPrompt";
import PWAUpdatePrompt from "./components/common/PWAUpdatePrompt";
import OfflineBanner from "./components/common/OfflineBanner";
import PublicRouter from "./routes/PublicRoutes";

function App() {
  useEffect(() => {
    startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen w-full overflow-x-hidden">
        {/* PWA Components */}
        <OfflineBanner />
        <PWAUpdatePrompt />
        <PWAInstallPrompt />

        <>
          <Navbar />
          <main className="w-full">
            <PublicRouter />
          </main>
          <Footer />
        </>
        <NewsModal />
        <ArticlesModal />
        <TopicsModal />
      </div>
    </AuthProvider>
  );
}

export default App;

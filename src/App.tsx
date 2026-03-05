import { useEffect } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/layouts/common/Footer";
import Navbar from "./components/layouts/common/Navbar";
import ArticlesModal from "./components/modals/entertainment/articles";
import NewsModal from "./components/modals/entertainment/news";
import TopicsModal from "./components/modals/entertainment/topics";
import { startKeepAlive, stopKeepAlive } from "./services/keepAlive";

import PublicRouter from "./routes/PublicRoutes";

function App() {
  useEffect(() => {
    // Start keep-alive service when app mounts
    startKeepAlive();

    // Cleanup on unmount
    return () => {
      stopKeepAlive();
    };
  }, []);
  return (
    <AuthProvider>
      <div className="min-h-screen w-full overflow-x-hidden">
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

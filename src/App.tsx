import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import Footer from "./components/layouts/common/Footer";
import Navbar from "./components/layouts/common/Navbar";
import ArticlesModal from "./components/modals/entertainment/articles";
import NewsModal from "./components/modals/entertainment/news";
import TopicsModal from "./components/modals/entertainment/topics";

import PublicRouter from "./routes/PublicRoutes";

function App() {
  return (
    <AuthProvider>
      <div>
        <>
          <Navbar />
          <PublicRouter />
          <Footer />
        </>
        <AuthModal />
        <NewsModal />
        <ArticlesModal />
        <TopicsModal />
      </div>
    </AuthProvider>
  );
}

export default App;

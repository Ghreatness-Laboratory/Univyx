import React from "react";
import { Route, Routes } from "react-router-dom";

import Resources from "../components/layouts/academics/Resources";
import Academics from "../pages/Academics";
import Admin from "../pages/Admin";
import Entertainment from "../pages/Entertainment";
import Gaming from "../pages/Gaming";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Store from "../pages/Store";
import ArticleDetail from "../pages/ArticleDetail";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import ScrollToTop from "./ScrollToTop";

const PublicRouter: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/:universityId" element={<Resources />} />
        <Route path="/gaming" element={<Gaming />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/entertainment/articles/:id" element={<ArticleDetail />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

export default PublicRouter;

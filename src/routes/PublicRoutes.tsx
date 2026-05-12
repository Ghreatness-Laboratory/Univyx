import React from "react";
import { Route, Routes } from "react-router-dom";

import Resources from "../components/layouts/academics/Resources";
import Academics from "../pages/Academics";
import Admin from "../pages/Admin";
import Entertainment from "../pages/Entertainment";
import Gaming from "../pages/Gaming";
import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Store from "../pages/Store";
import ArticleDetail from "../pages/ArticleDetail";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import AddEvent from "../pages/admin/AddEvent";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "../components/common/ProtectedRoute";

const PublicRouter: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public routes - no login required */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected routes - login required */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Private students only - can post and engage */}
        <Route path="/entertainment" element={<ProtectedRoute requirePrivateStudent><Entertainment /></ProtectedRoute>} />
        <Route path="/entertainment/articles/:id" element={<ProtectedRoute requirePrivateStudent><ArticleDetail /></ProtectedRoute>} />
        <Route path="/gaming" element={<ProtectedRoute requirePrivateStudent><Gaming /></ProtectedRoute>} />
        <Route path="/store" element={<ProtectedRoute requirePrivateStudent><Store /></ProtectedRoute>} />
        
        {/* All authenticated users - view only for non-private students */}
        <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
        <Route path="/academics/:universityId" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        
        {/* User profile and admin */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/events/add" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

export default PublicRouter;

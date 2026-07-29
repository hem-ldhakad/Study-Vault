import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import Home from './pages/Home';
import BrowseNotes from './pages/BrowseNotes';
import Categories from './pages/Categories';
import Subjects from './pages/Subjects';
import Chapters from './pages/Chapters';
import NoteDetails from './pages/NoteDetails';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadNote from './pages/admin/UploadNote';
import ManageNotes from './pages/admin/ManageNotes';
import ManageCategories from './pages/admin/ManageCategories';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageChapters from './pages/admin/ManageChapters';
import ManageUsers from './pages/admin/ManageUsers';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NoteProvider>
          <BrowserRouter>
            <Routes>
              {/* Main Platform Layout Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="browse" element={<BrowseNotes />} />
                <Route path="recent" element={<BrowseNotes />} />
                <Route path="popular" element={<BrowseNotes />} />
                <Route path="categories" element={<Categories />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="chapters" element={<Chapters />} />
                <Route path="notes/:id" element={<NoteDetails />} />

                {/* Protected Private User Routes */}
                <Route
                  path="bookmarks"
                  element={
                    <ProtectedRoute>
                      <Bookmarks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Authentication Layout Routes */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Admin Portal Layout Routes (Protected by AdminRoute) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="upload" element={<UploadNote />} />
                <Route path="notes" element={<ManageNotes />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="subjects" element={<ManageSubjects />} />
                <Route path="chapters" element={<ManageChapters />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

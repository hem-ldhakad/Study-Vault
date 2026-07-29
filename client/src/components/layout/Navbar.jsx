import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, Search, LogOut, User, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotes } from '../../hooks/useNotes';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { searchQuery, setSearchQuery, fetchNotes } = useNotes();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNotes({ search: searchQuery });
    navigate('/browse');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left branding & menu button */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black pastel-gradient-text tracking-tight">
              StudyVault
            </span>
          </Link>
        </div>

        {/* Center Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search notes by title, topic, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-300 pl-10 pr-4 py-2 rounded-full text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
          </div>
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Bookmarks Link */}
          {isAuthenticated && (
            <Link
              to="/bookmarks"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-indigo-600 transition-colors shadow-sm"
              title="My Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
            </Link>
          )}

          {/* User Profile Dropdown or Login Buttons */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm font-bold text-slate-900 transition shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="hidden md:inline">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-3xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-700 font-medium truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-900 font-bold hover:bg-slate-100"
                  >
                    <User className="w-4 h-4 text-indigo-600" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-700 font-bold hover:bg-slate-100"
                    >
                      <Shield className="w-4 h-4" /> Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-slate-100 text-left font-bold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

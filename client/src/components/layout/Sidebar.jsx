import React from 'react';
import { Folder, Layers, Book, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ className = '' }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setSelectedSubject,
    clearFilters,
  } = useNotes();

  const { isAdmin } = useAuth();
  const location = useLocation();

  const handleCategoryClick = (catId) => {
    if (selectedCategory === catId) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(catId);
    }
    setSelectedSubject('');
  };

  return (
    <aside className={`w-64 glass-panel border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto ${className}`}>
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 px-2">Discover</h4>
          <nav className="space-y-1.5">
            <Link
              to="/browse"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                location.pathname === '/browse' && !selectedCategory
                  ? 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/30'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              All Notes
            </Link>

            <Link
              to="/categories"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                location.pathname === '/categories'
                  ? 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/30'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Folder className="w-4 h-4 text-indigo-600" />
              Categories
            </Link>

            <Link
              to="/subjects"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                location.pathname === '/subjects'
                  ? 'bg-purple-500/15 text-purple-700 border border-purple-500/30'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Book className="w-4 h-4 text-purple-600" />
              Subjects
            </Link>

            <Link
              to="/chapters"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                location.pathname === '/chapters'
                  ? 'bg-pink-500/15 text-pink-700 border border-pink-500/30'
                  : 'text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-pink-600" />
              Chapters
            </Link>
          </nav>
        </div>

        {/* Categories Direct Filter */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Quick Filter</h4>
            {selectedCategory && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {categories.slice(0, 8).map((cat) => {
              const isSelected = selectedCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                    <span className="truncate">{cat.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 mb-3 px-2">Management</h4>
            <nav className="space-y-1.5">
              <Link
                to="/admin"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-amber-800 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                Admin Portal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

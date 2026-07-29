import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-800 text-sm py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-extrabold text-slate-900">StudyVault</span>
          <span className="text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-700">Academic Notes Sharing Platform</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold text-slate-900">
          <Link to="/browse" className="hover:text-indigo-600 transition">Browse Notes</Link>
          <Link to="/categories" className="hover:text-indigo-600 transition">Categories</Link>
          <Link to="/subjects" className="hover:text-indigo-600 transition">Subjects</Link>
        </div>

        <p className="text-xs font-bold text-slate-700">
          &copy; {new Date().getFullYear()} StudyVault. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

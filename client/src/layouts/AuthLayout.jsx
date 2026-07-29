import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Branding */}
      <Link to="/" className="flex items-center gap-2 mb-8 z-10 group">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          StudyVault
        </span>
      </Link>

      {/* Centered Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 z-10"
      >
        <Outlet />
      </motion.div>

      {/* Footer copyright */}
      <p className="mt-8 text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} StudyVault. Secure Academic Notes Platform.
      </p>
    </div>
  );
};

export default AuthLayout;

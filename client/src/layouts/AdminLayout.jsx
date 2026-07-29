import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Upload,
  FileText,
  Folder,
  Book,
  Layers,
  Users,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Upload Note', path: '/admin/upload', icon: Upload },
    { label: 'Manage Notes', path: '/admin/notes', icon: FileText },
    { label: 'Categories', path: '/admin/categories', icon: Folder },
    { label: 'Subjects', path: '/admin/subjects', icon: Book },
    { label: 'Chapters', path: '/admin/chapters', icon: Layers },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-4 mb-6 border-b border-slate-200">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-700 rounded-xl shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base leading-tight">Admin Portal</h2>
              <p className="text-xs text-amber-700 font-bold">StudyVault Control</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                      : 'text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-700" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-2 mt-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Platform
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition text-left"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Dashboard Content Area */}
      <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Folder,
  Download,
  Eye,
  Upload,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { formatNumber, formatDate } from '../../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then((res) => {
        if (res?.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching admin dashboard stats:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Loading Dashboard Overview...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Notes', value: stats?.totalNotes || 0, icon: FileText, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
    { label: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: Folder, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
    { label: 'Total Downloads', value: stats?.totalDownloads || 0, icon: Download, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
    { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Overview</h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm font-medium mt-1">
            Platform metrics and recent upload activity on StudyVault
          </p>
        </div>

        <Link to="/admin/upload">
          <Button icon={Upload} size="md">
            Upload New Note
          </Button>
        </Link>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border shadow-sm ${card.bg} flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{formatNumber(card.value)}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Shortcuts */}
      <Card hover={false} className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Administrative Quick Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <Link
            to="/admin/upload"
            className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition flex items-center justify-between"
          >
            <span>Upload PDF Note</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/categories"
            className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition flex items-center justify-between"
          >
            <span>Manage Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/subjects"
            className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition flex items-center justify-between"
          >
            <span>Manage Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/notes"
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition flex items-center justify-between"
          >
            <span>Catalog Management</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* Recent Notes Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Recent Uploads
          </h3>
          <Link to="/admin/notes" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Notes &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Views</th>
                <th className="px-6 py-3.5">Downloads</th>
                <th className="px-6 py-3.5">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
              {stats?.recentNotes?.length > 0 ? (
                stats.recentNotes.map((note) => (
                  <tr key={note._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {note.title}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="indigo">{note.category?.name || 'General'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold">{formatNumber(note.views)}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold">{formatNumber(note.downloads)}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{formatDate(note.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-700 dark:text-slate-300 font-bold">
                    No notes uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

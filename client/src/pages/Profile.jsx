import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    userService.getBookmarks().then((res) => {
      if (res?.data?.bookmarks) {
        setBookmarkCount(res.data.bookmarks.length);
      }
    }).catch(console.error);
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Account Profile</h1>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mt-1">Manage your account settings and preferences</p>
      </div>

      <Card hover={false} className="space-y-6">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white uppercase shadow-xl shadow-indigo-500/20">
            {user.name?.[0] || 'U'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
              <Badge variant={user.role === 'admin' ? 'amber' : 'indigo'}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{user.email}</p>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold uppercase">Email Address</p>
              <p className="font-bold text-slate-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold uppercase">User Role</p>
              <p className="font-bold text-slate-900 dark:text-white capitalize">{user.role}</p>
            </div>
          </div>

          <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold uppercase">Saved Bookmarks</p>
              <p className="font-bold text-slate-900 dark:text-white">{bookmarkCount} notes</p>
            </div>
          </div>

          <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold uppercase">Member Since</p>
              <p className="font-bold text-slate-900 dark:text-white">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 flex justify-end">
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            icon={LogOut}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

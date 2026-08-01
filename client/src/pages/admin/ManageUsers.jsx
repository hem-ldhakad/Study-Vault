import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Calendar,
  Mail,
  User,
  Bookmark,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { userService } from '../../services/userService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { formatDate } from '../../utils/formatters';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res?.data?.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user._id);
    try {
      await userService.updateUserRole(user._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Error updating user role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    setDeletingId(confirmDeleteUser._id);
    try {
      await userService.deleteUser(confirmDeleteUser._id);
      setUsers((prev) => prev.filter((u) => u._id !== confirmDeleteUser._id));
      setConfirmDeleteUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.role || '').toLowerCase().includes(term)
    );
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const regularUsersCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Registered Users Directory
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm font-medium mt-1">
            View user details, manage administrator roles, and monitor account activity.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchUsers} icon={RefreshCw}>
          Refresh Directory
        </Button>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Total Accounts
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {totalUsers}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Administrators
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {adminCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Students / Users
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {regularUsersCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      {/* Main Users Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-bold text-slate-800 animate-pulse">Loading user directory details...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No Users Found</h3>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
            No registered accounts matched your search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-black uppercase text-slate-900 dark:text-slate-200 tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Bookmarks</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-bold text-slate-900 dark:text-slate-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* User Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{user.name}</p>
                          <span className="text-[11px] text-slate-500 font-semibold">ID: {user._id.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-6">
                      <Badge variant={user.role === 'admin' ? 'purple' : 'emerald'}>
                        {user.role === 'admin' ? 'Administrator' : 'Student'}
                      </Badge>
                    </td>

                    {/* Bookmarks Count */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <Bookmark className="w-4 h-4 text-indigo-500" />
                        <span>{user.bookmarks?.length || 0} saved</span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={updatingId === user._id}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition border border-slate-200 dark:border-slate-700"
                        >
                          {updatingId === user._id ? (
                            'Updating...'
                          ) : user.role === 'admin' ? (
                            'Make Student'
                          ) : (
                            'Make Admin'
                          )}
                        </button>

                        <button
                          onClick={() => setConfirmDeleteUser(user)}
                          className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition border border-rose-200 dark:border-rose-800"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete User Account</h3>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{confirmDeleteUser.name}</strong> ({confirmDeleteUser.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmDeleteUser(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteUser}
                loading={deletingId === confirmDeleteUser._id}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

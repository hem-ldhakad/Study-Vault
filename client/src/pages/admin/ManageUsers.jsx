import React, { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';

export const ManageUsers = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Registered Users Directory</h1>
        <p className="text-slate-800 dark:text-slate-200 text-sm font-medium mt-1">View user accounts and administrator roles on StudyVault</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 pr-4 py-2 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl p-8 text-center">
        <Users className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">User Directory Active</h3>
        <p className="max-w-md mx-auto mt-1 text-slate-800 dark:text-slate-200 text-xs font-semibold">
          Registered accounts on StudyVault will be displayed here for administrative overview.
        </p>
      </div>
    </div>
  );
};

export default ManageUsers;

import React, { useState } from 'react';
import { Settings, Shield, HardDrive, Server, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { APP_NAME, API_BASE_URL } from '../../utils/constants';

export const AdminSettings = () => {
  const [toastMsg, setToastMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setToastMsg('System settings updated successfully');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Platform configuration and server environment parameters</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <Card hover={false} className="space-y-4">
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Settings className="w-5 h-5 text-indigo-400" /> Platform General Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue={APP_NAME}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Max Upload Limit
              </label>
              <input
                type="text"
                defaultValue="10 MB (PDF, Images)"
                disabled
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        <Card hover={false} className="space-y-4">
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Server className="w-5 h-5 text-purple-400" /> Server Endpoint Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                API Base URL
              </label>
              <input
                type="text"
                defaultValue={API_BASE_URL}
                disabled
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Environment
              </label>
              <input
                type="text"
                defaultValue={import.meta.env.MODE || 'development'}
                disabled
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-xs uppercase cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" icon={CheckCircle}>
            Save System Settings
          </Button>
        </div>
      </form>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default AdminSettings;

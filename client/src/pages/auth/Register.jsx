import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminSecret, setAdminSecret] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (role === 'admin' && !adminSecret) {
      setErrorMsg('Admin Secret Key is required to register as Administrator');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, role, adminSecret });
      setToastMsg('Account created successfully!');
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin' : '/');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-100">Create Account</h2>
        <p className="text-xs text-slate-400">Join StudyVault to access academic materials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <Input
          label="Full Name *"
          type="text"
          placeholder="Alex Johnson"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address *"
          type="email"
          placeholder="alex@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password *"
          type="password"
          placeholder="Minimum 6 characters"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Account Type
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Conditional Admin Secret Input without helper text */}
        {role === 'admin' && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl">
            <Input
              label="Admin Secret Key *"
              type="password"
              placeholder="Enter Admin Secret Key"
              icon={ShieldAlert}
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" size="md" className="w-full" loading={submitting} icon={UserCheck}>
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-400 hover:underline inline-flex items-center gap-0.5">
          Sign In <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default Register;

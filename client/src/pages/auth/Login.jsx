import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ email: email.trim(), password, adminSecret: adminSecret.trim() });

      setToastMsg('Logged in successfully!');
      setTimeout(() => {
        if (res?.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-400">Sign in to your StudyVault account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Sign in as Administrator
          </label>
        </div>

        {isAdminLogin && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl">
            <Input
              label="Admin Secret Key"
              type="password"
              placeholder="Enter Admin Secret Key"
              icon={ShieldAlert}
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
            />
          </div>
        )}

        <Button type="submit" size="md" className="w-full" loading={submitting} icon={LogIn}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-400 hover:underline inline-flex items-center gap-0.5">
          Register now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <Toast message={toastMsg} type="info" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default Login;

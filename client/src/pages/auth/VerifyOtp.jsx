import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';

export const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const otpParam = searchParams.get('otp') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(otpParam);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
  }, [emailParam, otpParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !otp) {
      setErrorMsg('Please enter email and 6-digit OTP code');
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp({ email, otp });
      setToastMsg('Admin OTP verified! Redirecting...');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-100">Admin 2-Step Verification</h2>
        <p className="text-xs text-slate-400">Enter the 6-digit OTP security code sent to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {otpParam && (
          <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-xs rounded-xl flex items-center justify-between">
            <span>Dev Mode OTP Code:</span>
            <strong className="font-mono text-sm tracking-widest bg-amber-900/60 px-2 py-0.5 rounded">{otpParam}</strong>
          </div>
        )}

        <Input
          label="Admin Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="6-Digit OTP Code *"
          type="text"
          placeholder="123456"
          icon={KeyRound}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="font-mono tracking-widest text-center text-lg font-bold"
        />

        <Button type="submit" size="md" className="w-full" loading={submitting} icon={ShieldCheck}>
          Verify & Sign In
        </Button>
      </form>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default VerifyOtp;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { Search as Google, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';

export function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setModeMethod] = useState<'email' | 'phone'>('email');
  const { login, register } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        const [firstName, ...rest] = fullName.trim().split(' ');
        await register({
          firstName: firstName || fullName,
          lastName: rest.join(' ') || firstName || '',
          email,
          phone: phone ? `+234${phone}` : '',
          password,
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 font-sans">
      <Seo
        title="Login or Sign Up"
        description="Access your CleanNaija account to book, track and manage your cleaning services."
        path="/auth"
        noindex
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white shadow-2xl border-t-8 border-primary overflow-hidden"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <img src="/logo.png" alt="CleanNaija - Spotless Every Surface" className="h-12 md:h-16 w-auto object-contain" />
            </Link>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter mb-2">
              {mode === 'login' ? 'Mission Control' : 'Join the Squad'}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {mode === 'login' ? 'Sign in to manage your spaces' : 'Create an account for a spotless life'}
            </p>
          </div>

          <div className="flex border-b-2 border-gray-100 mb-8">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${mode === 'login' ? 'text-primary border-b-4 border-primary' : 'text-gray-300 hover:text-gray-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${mode === 'register' ? 'text-primary border-b-4 border-primary' : 'text-gray-300 hover:text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-6">
            <Button variant="outline" className="w-full py-4 border-2 flex items-center justify-center space-x-3 rounded-none font-black uppercase text-[10px] tracking-widest hover:bg-secondary">
              <Google className="w-4 h-4 text-primary" />
              <span>Continue with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest bg-white px-4 text-gray-300">Or use {method}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {method === 'email' ? (
                <Input type="email" label="Work / Personal Email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              ) : (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-secondary-dark mb-1">Phone Number</label>
                  <div className="flex">
                    <div className="bg-secondary border border-gray-300 border-r-0 px-4 flex items-center font-black text-xs text-gray-400">+234</div>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="flex-1 h-11 border border-gray-300 px-4 focus:outline-primary font-bold text-sm" placeholder="8012345678" required />
                  </div>
                </div>
              )}

              {/* Email is always required by the backend, so collect it on phone-mode registration too. */}
              {method === 'phone' && mode === 'register' && (
                <Input type="email" label="Email Address" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              )}

              <Input type="password" label="Secure Password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />

              {mode === 'register' && (
                <Input type="text" label="Full Name" placeholder="e.g. Chidi Okeke" value={fullName} onChange={e => setFullName(e.target.value)} required />
              )}

              {error && (
                <p className="text-xs font-bold uppercase tracking-widest text-red-500 text-center">{error}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-primary text-white py-6 rounded-none font-black uppercase tracking-[0.2em] shadow-xl hover:bg-accent-orange transition-all disabled:opacity-50">
                {submitting ? 'Please wait…' : mode === 'login' ? 'Authorize Login' : 'Complete Registration'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="text-center space-y-4">
              <button 
                onClick={() => setModeMethod(method === 'email' ? 'phone' : 'email')}
                className="text-[10px] font-black text-accent-gold uppercase tracking-widest hover:underline"
              >
                Use {method === 'email' ? 'Phone Number' : 'Email Address'} instead
              </button>
              {mode === 'login' && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Forgot Password? <a href="#" className="text-primary hover:underline">Request Reset</a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 p-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you agree to CleanNaija's <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

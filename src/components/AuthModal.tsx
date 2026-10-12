import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  KeyRound,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage, TRANSLATIONS } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialMode = 'login'
}) => {
  const { login, currentUser } = useAuth();
  const t = TRANSLATIONS[currentLang];

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>(initialMode);
  const [role, setRole] = useState<'entrepreneur' | 'customer'>('entrepreneur');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('vedant.mishra@gramai.in');
  const [phone, setPhone] = useState('+91 94310 44521');
  const [password, setPassword] = useState('GramAI@2026');
  const [location, setLocation] = useState('Varanasi, Uttar Pradesh');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await login(email);
      onClose();
    } catch (err) {
      setMessage('Invalid credentials. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    // Move to OTP verification step
    setTimeout(() => {
      setLoading(false);
      setMode('otp');
      setMessage(`OTP sent to ${phone || email}. (Use test code: 1234)`);
    }, 600);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      onClose();
    } catch (err) {
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode('otp');
      setMessage(`Password reset OTP dispatched to ${email}. (Test code: 1234)`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-800 dark:text-slate-100 transition-colors">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#22C55E]" />
            <span>Gram AI Secure Auth · JWT & OTP</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'otp' && 'Verify OTP Code'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Access your artisan dashboard, UPI transactions, or saved orders.'}
            {mode === 'signup' && 'Join 12,400+ rural artisans and conscious buyers on Gram AI.'}
            {mode === 'forgot' && 'Enter your registered email or mobile to receive recovery OTP.'}
            {mode === 'otp' && 'Enter the 4-digit code sent to your mobile.'}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 font-medium">
            {message}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@gramai.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[#2E7D32] dark:text-[#22C55E] hover:underline font-medium text-[11px] cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4A017]" /> : <ArrowRight className="w-4 h-4 text-[#D4A017] dark:text-slate-900" />}
              <span>Sign In with Gram AI</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            {/* Role Selector */}
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('entrepreneur')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${
                    role === 'entrepreneur'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] dark:bg-[#22C55E] dark:text-slate-950'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🌾 Rural Entrepreneur / Artisan
                </button>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${
                    role === 'customer'
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] dark:bg-[#22C55E] dark:text-slate-950'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🛍️ Urban Conscious Buyer
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vedant Mishra"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vedant@mishracrafts.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Phone (OTP)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Location / Village</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Varanasi, UP"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4A017]" /> : <CheckCircle2 className="w-4 h-4 text-[#D4A017] dark:text-slate-900" />}
              <span>Continue to Mobile OTP Verification</span>
            </button>

            <div className="pt-1 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@gramai.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4A017]" /> : <KeyRound className="w-4 h-4 text-[#D4A017] dark:text-slate-900" />}
              <span>Send Recovery Code</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* OTP VERIFICATION STEP */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
            <div className="text-center space-y-2">
              <span className="text-[11px] text-slate-500">Enter the 4-digit code sent to your phone:</span>
              <div className="flex justify-center gap-2 my-2">
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1234"
                  className="w-36 text-center tracking-widest text-2xl font-mono py-2 rounded-xl border-2 border-[#2E7D32] dark:border-[#22C55E] bg-white dark:bg-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setOtpCode('1234')}
                className="text-xs text-[#2E7D32] dark:text-[#22C55E] font-semibold hover:underline cursor-pointer"
              >
                Auto-fill Demo Code (1234)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4A017]" /> : <CheckCircle2 className="w-4 h-4 text-[#D4A017] dark:text-slate-900" />}
              <span>Verify & Complete Login</span>
            </button>

            <div className="pt-1 text-center text-xs text-slate-500">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={() => setMessage('Resent OTP! (Use: 1234)')}
                className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

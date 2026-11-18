import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { BazaarLogo } from '../../components/common/BazaarLogo';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('aarav.customer@bazaarone.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login(email, password);
    if (res.success) {
      navigate('/customer');
    } else {
      setError(res.error || 'Authentication error');
    }
    setIsLoading(false);
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-stone-850 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bazaar-maroon to-bazaar-saffron mx-auto flex items-center justify-center p-2 shadow-md">
            <BazaarLogo className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black font-display text-stone-900 dark:text-white">
            Welcome to Bazaar One
          </h2>
          <p className="text-xs text-stone-500">
            Sign in to access your unified shopping planner, orders, and local store network
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              Email Address:
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                required
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                required
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In with Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-700" />
          </div>
          <span className="relative px-3 bg-white dark:bg-stone-850 text-xs text-stone-400 font-medium">
            OR
          </span>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google Sign-In</span>
        </button>

        <p className="text-center text-xs text-stone-500">
          Need an account?{' '}
          <Link to="/register" className="font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline">
            Register as Customer, Merchant or Delivery Partner
          </Link>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole } from '../../types';
import {
  Store,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Building2,
  Package,
  CalendarCheck,
} from 'lucide-react';
import { BazaarLogo } from '../../components/common/BazaarLogo';

export const RoleGatewayAuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'customer';

  const [selectedRole, setSelectedRole] = useState<'customer' | 'vendor'>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const { login, register, loginWithGoogle, switchUserRoleDemo } = useAuth();
  const { addShop } = useMarketplace();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('+91 98');

  // Vendor extra fields
  const [shopName, setShopName] = useState('');
  const [marketType, setMarketType] = useState<'traditional' | 'modern'>('traditional');
  const [category, setCategory] = useState('kirana');
  const [area, setArea] = useState('Sadashiv Peth');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set default credentials when switching between consumer vs vendor
  const handleSelectRole = (r: 'customer' | 'vendor') => {
    setSelectedRole(r);
    setErrorMsg(null);
    if (r === 'customer') {
      setEmail('aarav.customer@bazaarone.in');
    } else {
      setEmail('rameshwar.vendor@bazaarone.in');
    }
  };

  // 1-Click Instant Demo Login for fast user evaluation
  const handleInstantDemoLogin = (r: 'customer' | 'vendor') => {
    switchUserRoleDemo(r);
    if (r === 'vendor') {
      navigate('/vendor');
    } else {
      navigate('/customer');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (authMode === 'login') {
      const res = await login(email || (selectedRole === 'vendor' ? 'rameshwar.vendor@bazaarone.in' : 'aarav.customer@bazaarone.in'), password);
      if (res.success) {
        navigate(selectedRole === 'vendor' ? '/vendor' : '/customer');
      } else {
        setErrorMsg(res.error || 'Login failed');
      }
    } else {
      // Register
      let createdShopId: string | undefined = undefined;
      if (selectedRole === 'vendor') {
        const newShop = addShop({
          name: shopName || `${displayName}'s Store`,
          ownerId: 'vendor-' + Date.now(),
          ownerName: displayName || 'Merchant',
          marketType,
          category,
          description: `Verified ${marketType} vendor in ${area}, providing genuine products and prompt service.`,
          imageUrl:
            marketType === 'traditional'
              ? 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800'
              : 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
          rating: 5.0,
          ratingCount: 1,
          contactNumber: phone,
          address: {
            street: 'Main Road',
            area,
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411030',
            lat: 18.5204,
            lng: 73.8567,
          },
          openingTime: '08:00 AM',
          closingTime: '09:00 PM',
          isOpenToday: true,
          offersDelivery: true,
          offersPickup: true,
          minimumOrder: 100,
          deliveryFee: 30,
          isVerified: true,
          createdAt: new Date().toISOString(),
        });
        createdShopId = newShop.id;
      }

      const res = await register(
        {
          displayName: displayName || (selectedRole === 'vendor' ? 'Store Merchant' : 'Valued Customer'),
          email,
          phoneNumber: phone,
          role: selectedRole,
          shopId: createdShopId,
        },
        password
      );

      if (res.success) {
        navigate(selectedRole === 'vendor' ? '/vendor' : '/customer');
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-bazaar-cream-200/60 via-bazaar-cream-100 to-white dark:from-stone-950 dark:to-stone-900">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bazaar-maroon via-bazaar-maroon-600 to-bazaar-saffron mx-auto flex items-center justify-center p-2 shadow-lg">
            <BazaarLogo className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-stone-850 border border-bazaar-saffron/40 shadow-sm text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron">
            <Sparkles className="w-3.5 h-3.5 text-bazaar-saffron" />
            <span>Unified Indian Marketplace Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900 dark:text-white">
            How would you like to enter Bazaar One?
          </h1>

          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
            Select your account profile below to access personalized tools for shoppers or retail store owners
          </p>
        </div>

        {/* Big Dual-Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Consumer Card */}
          <div
            onClick={() => handleSelectRole('customer')}
            className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              selectedRole === 'customer'
                ? 'border-bazaar-maroon bg-white dark:bg-stone-850 shadow-2xl ring-4 ring-bazaar-maroon/10 scale-[1.01]'
                : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:border-bazaar-maroon/40 shadow-sm'
            }`}
          >
            {selectedRole === 'customer' && (
              <div className="absolute top-0 right-0 bg-bazaar-maroon text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Selected Profile
              </div>
            )}

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-bazaar-maroon to-bazaar-saffron text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <span>Consumer / Shopper</span>
                  <span className="text-sm font-semibold text-bazaar-maroon dark:text-bazaar-saffron">(ग्राहक)</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  For households and families wanting fresh morning vegetables, pure desi ghee, pulses, hypermarket items, and AI weekly budgeting.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Daily, Weekly & Monthly Smart Shopping Planners</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Direct phone & WhatsApp calling to verified storekeepers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Instant UPI QR, Cash on Delivery & Downloadable GST Invoices</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstantDemoLogin('customer');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Instant 1-Click Demo as Shopper (Aarav)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Shopkeeper Card */}
          <div
            onClick={() => handleSelectRole('vendor')}
            className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              selectedRole === 'vendor'
                ? 'border-amber-500 bg-white dark:bg-stone-850 shadow-2xl ring-4 ring-amber-500/10 scale-[1.01]'
                : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:border-amber-400 shadow-sm'
            }`}
          >
            {selectedRole === 'vendor' && (
              <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Selected Profile
              </div>
            )}

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-md">
                <Store className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <span>Shopkeeper / Vendor</span>
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">(दुकानदार)</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  For kirana store owners, mandi vegetable vendors, dairy merchants, and retail businesses to manage sales and grow digitally.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Real-time Sales Revenue dashboard & growth charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Incoming order alerts, packing status & delivery assignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Live Inventory control, low stock alerts & customer bargains</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstantDemoLogin('vendor');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Instant 1-Click Demo as Store Owner (Rameshwar)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Customized Auth Form Card */}
        <div className="max-w-md mx-auto bg-white dark:bg-stone-850 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
          {/* Toggle Login vs Register */}
          <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                authMode === 'login'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Sign In as {selectedRole === 'vendor' ? 'Store Owner' : 'Consumer'}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                authMode === 'register'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name / Proprietor Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Lal Gupta"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  required
                />
              </div>
            )}

            {/* Shop Owner Registration Fields */}
            {authMode === 'register' && selectedRole === 'vendor' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900 dark:text-amber-400 block">
                  Store Details
                </span>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Shop Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shree Ganesh Kirana & Grain Merchants"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Market Type:
                    </label>
                    <select
                      value={marketType}
                      onChange={(e) => setMarketType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700"
                    >
                      <option value="traditional">Traditional Mandi / Bazaar</option>
                      <option value="modern">Modern Retail / Supermarket</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Area / City:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sadashiv Peth, Pune"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Email Address:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  placeholder={selectedRole === 'vendor' ? 'merchant@bazaarone.in' : 'shopper@bazaarone.in'}
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
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 text-white ${
                selectedRole === 'vendor'
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                  : 'bg-bazaar-maroon hover:bg-bazaar-maroon-700 shadow-bazaar-maroon/30'
              }`}
            >
              <span>
                {isLoading
                  ? 'Verifying...'
                  : authMode === 'login'
                  ? `Sign In as ${selectedRole === 'vendor' ? 'Store Owner' : 'Consumer'}`
                  : `Create ${selectedRole === 'vendor' ? 'Vendor' : 'Shopper'} Account`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

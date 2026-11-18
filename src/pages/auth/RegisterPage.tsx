import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../../types';
import { Store, User, Truck, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { addShop } = useMarketplace();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');

  // Vendor extra fields
  const [shopName, setShopName] = useState('');
  const [marketType, setMarketType] = useState<'traditional' | 'modern'>('traditional');
  const [category, setCategory] = useState('kirana');
  const [area, setArea] = useState('Sadashiv Peth');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let createdShopId: string | undefined = undefined;

    if (role === 'vendor') {
      const newShop = addShop({
        name: shopName || `${name}'s Store`,
        ownerId: 'vendor-' + Date.now(),
        ownerName: name,
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
        displayName: name,
        email,
        phoneNumber: phone,
        role,
        shopId: createdShopId,
      },
      password
    );

    if (res.success) {
      if (role === 'vendor') navigate('/vendor');
      else if (role === 'delivery') navigate('/delivery');
      else navigate('/customer');
    } else {
      setError(res.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-stone-850 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black font-display text-stone-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="text-xs text-stone-500">
            Join the unified ecosystem connecting traditional Indian bazaars and modern retail
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            Select Your Role:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'customer'
                  ? 'border-bazaar-maroon bg-bazaar-maroon/10 text-bazaar-maroon ring-2 ring-bazaar-maroon'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <User className="w-4 h-4 text-bazaar-maroon" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'vendor'
                  ? 'border-bazaar-saffron bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-white ring-2 ring-bazaar-saffron font-bold'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Store className="w-4 h-4 text-bazaar-saffron" />
              <span>Shopkeeper</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('delivery')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'delivery'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-600'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Delivery Rider</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              Full Name / Proprietor Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Rameshwar Lal Gupta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Email Address:
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Mobile Number:
              </label>
              <input
                type="tel"
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                required
              />
            </div>
          </div>

          {/* Shopkeeper specific extra registration fields */}
          {role === 'vendor' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                Shop & Business Details
              </h4>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Shop / Establishment Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shree Ganesh Kirana & Spices"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
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
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                  >
                    <option value="traditional">Traditional Bazaar / Mandi</option>
                    <option value="modern">Modern Retail / Supermart</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Primary Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                  >
                    <option value="kirana">Kirana Stores (किराना)</option>
                    <option value="vegetables">Fresh Vegetables (भाजीपाला)</option>
                    <option value="dairy">Dairy & Pure Ghee</option>
                    <option value="spices">Spices & Masalas</option>
                    <option value="traditional-snacks">Sweets & Snacks</option>
                    <option value="supermarkets">Supermarkets</option>
                    <option value="organic">Organic Certified</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              Create Password:
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-xs shadow-md transition-all"
          >
            {isLoading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  MapPin,
  CalendarCheck,
  User,
  Search,
  Menu,
  X,
  FileText,
  ShieldCheck,
  Truck,
  Store,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAI: () => void;
  onOpenExportModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAI, onOpenExportModal }) => {
  const { user, role, switchUserRoleDemo, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { searchQuery, setSearchQuery } = useMarketplace();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/marketplace') {
      navigate('/marketplace');
    }
  };

  const rolesList: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'customer', label: 'Customer (Shopper)', icon: User, color: 'text-amber-600' },
    { id: 'vendor', label: 'Shopkeeper / Vendor', icon: Store, color: 'text-bazaar-maroon-600' },
    { id: 'delivery', label: 'Delivery Partner', icon: Truck, color: 'text-emerald-600' },
    { id: 'admin', label: 'Super Admin', icon: ShieldCheck, color: 'text-purple-600' },
  ];

  const getDashboardRoute = () => {
    switch (role) {
      case 'vendor':
        return '/vendor';
      case 'delivery':
        return '/delivery';
      case 'admin':
        return '/admin';
      case 'customer':
      default:
        return '/customer';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-bazaar-cream-300 dark:border-stone-800 transition-all">
        {/* Top Announcement & Switcher Bar */}
        <div className="bg-bazaar-maroon text-bazaar-cream-100 text-xs py-1.5 px-4 font-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline bg-bazaar-saffron text-bazaar-charcoal px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Unified Indian Market
            </span>
            <span>Bridging traditional Kirana & Mandi vendors with modern retail enterprises</span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 bg-bazaar-maroon-700 hover:bg-bazaar-maroon-800 text-white px-2.5 py-1 rounded text-xs transition-colors border border-bazaar-maroon-500"
            >
              <span className="text-[10px] uppercase text-bazaar-saffron font-bold">Role:</span>
              <span className="font-semibold capitalize">{role}</span>
              <ChevronDown className="w-3 h-3 text-bazaar-saffron" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1.5 z-50 text-stone-800 dark:text-stone-100 animate-slide-up">
                <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800">
                  Switch Active Role
                </div>
                {rolesList.map((r) => {
                  const Icon = r.icon;
                  const isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchUserRoleDemo(r.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                        isActive ? 'bg-bazaar-cream-200/60 font-bold text-bazaar-maroon' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${r.color}`} />
                        <span>{r.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-bazaar-maroon" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Nav Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bazaar-maroon via-bazaar-maroon-600 to-bazaar-saffron flex items-center justify-center shadow-md p-1.5 group-hover:scale-105 transition-transform">
                <img src="/bazaar-logo.svg" alt="Bazaar One" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight font-display text-bazaar-maroon dark:text-bazaar-saffron flex items-center gap-1">
                  BAZAAR<span className="text-bazaar-saffron dark:text-white">ONE</span>
                </span>
                <span className="text-[10px] tracking-wide block font-semibold text-bazaar-green dark:text-emerald-400 uppercase">
                  Your Local Bazaar. Your Modern Marketplace.
                </span>
              </div>
            </Link>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search pulses, spices, veggies, supermarts or Hindi/Marathi (उदा. हळद, कांदा)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full focus:outline-none focus:ring-2 focus:ring-bazaar-maroon focus:bg-white dark:focus:bg-stone-900 transition-all shadow-inner text-stone-900 dark:text-white"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/marketplace"
                className={`transition-colors hover:text-bazaar-maroon dark:hover:text-bazaar-saffron ${
                  location.pathname === '/marketplace' ? 'text-bazaar-maroon font-bold' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Marketplace
              </Link>
              <Link
                to="/maps"
                className={`flex items-center gap-1.5 transition-colors hover:text-bazaar-maroon dark:hover:text-bazaar-saffron ${
                  location.pathname === '/maps' ? 'text-bazaar-maroon font-bold' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                <MapPin className="w-4 h-4 text-bazaar-saffron" />
                Live Map
              </Link>
              <Link
                to="/planner"
                className={`flex items-center gap-1.5 transition-colors hover:text-bazaar-maroon dark:hover:text-bazaar-saffron ${
                  location.pathname === '/planner' ? 'text-bazaar-maroon font-bold' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-bazaar-green" />
                Smart Planner
              </Link>
              <Link
                to={getDashboardRoute()}
                className={`transition-colors hover:text-bazaar-maroon dark:hover:text-bazaar-saffron ${
                  location.pathname.startsWith('/customer') ||
                  location.pathname.startsWith('/vendor') ||
                  location.pathname.startsWith('/delivery') ||
                  location.pathname.startsWith('/admin')
                    ? 'text-bazaar-maroon font-bold'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Dashboard
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Bazaar AI Button */}
              <button
                onClick={onOpenAI}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-bazaar-saffron/20 via-amber-100 to-bazaar-maroon/10 border border-bazaar-saffron/50 text-bazaar-maroon hover:shadow-md transition-all group"
              >
                <Sparkles className="w-4 h-4 text-bazaar-saffron group-hover:rotate-12 transition-transform" />
                <span>Bazaar AI</span>
              </button>

              {/* Document Reports trigger */}
              {onOpenExportModal && (
                <button
                  onClick={onOpenExportModal}
                  title="Export Bills & Reports"
                  className="hidden md:flex p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>
              )}

              {/* Shopping Cart Button with Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-bazaar-cream-200 dark:bg-stone-800 text-bazaar-maroon dark:text-bazaar-saffron hover:bg-bazaar-cream-300 dark:hover:bg-stone-700 transition-colors shadow-sm"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-bazaar-maroon text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 shadow animate-pulse-subtle">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* User Profile / Dashboard Avatar */}
              <Link
                to={getDashboardRoute()}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-bazaar-maroon text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-bazaar-saffron">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.displayName?.[0] || 'B'}</span>
                  )}
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <input
                type="text"
                placeholder="Search pulses, spices, shops, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            </form>

            <div className="flex flex-col gap-2 font-medium text-sm">
              <Link
                to="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
              >
                <span>Marketplace (Traditional & Modern)</span>
              </Link>
              <Link
                to="/maps"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-bazaar-saffron" />
                <span>Live Shop Discovery Map</span>
              </Link>
              <Link
                to="/planner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-bazaar-green" />
                <span>Smart Shopping Planner</span>
              </Link>
              <Link
                to={getDashboardRoute()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-bazaar-maroon" />
                <span>Active Dashboard ({role})</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAI();
                }}
                className="px-3 py-2 rounded-lg bg-bazaar-saffron/10 text-bazaar-maroon font-bold flex items-center gap-2 text-left"
              >
                <Sparkles className="w-4 h-4 text-bazaar-saffron" />
                <span>Ask Bazaar AI Assistant</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

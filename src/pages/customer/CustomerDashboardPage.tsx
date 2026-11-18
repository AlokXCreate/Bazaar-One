import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePlanner } from '../../context/PlannerContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatINR } from '../../utils/currency';
import {
  ShoppingBag,
  CalendarCheck,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useCart();
  const { plans } = usePlanner();
  const { shops } = useMarketplace();

  // Calculate monthly spending from orders
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Spending analytics data for Recharts
  const spendingTrend = [
    { day: 'Mon', amount: 350 },
    { day: 'Tue', amount: 820 },
    { day: 'Wed', amount: 510 },
    { day: 'Thu', amount: 1200 },
    { day: 'Fri', amount: 650 },
    { day: 'Sat', amount: 1840 },
    { day: 'Sun', amount: 960 },
  ];

  const categoryBreakdown = [
    { name: 'Kirana & Grains', value: 45, color: '#7A263A' },
    { name: 'Fresh Vegetables', value: 25, color: '#276749' },
    { name: 'Dairy & Ghee', value: 20, color: '#D9A441' },
    { name: 'Modern Retail', value: 10, color: '#F4A340' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-bazaar-maroon via-bazaar-maroon-700 to-amber-950 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex-shrink-0 flex items-center justify-center font-bold text-2xl text-bazaar-saffron">
            {user?.displayName?.[0] || 'A'}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-bazaar-saffron font-bold">
              Customer Portal • Verified Household
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Welcome back, {user?.displayName || 'Aarav Sharma'}!
            </h1>
            <p className="text-xs text-stone-200 mt-1">
              Sadashiv Peth, Pune • Supporting 4 verified neighborhood mandis & kirana merchants
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/planner"
            className="px-4 py-2.5 rounded-xl bg-bazaar-saffron hover:bg-bazaar-saffron/90 text-bazaar-charcoal font-bold text-xs shadow transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Open Shopping Planner</span>
          </Link>
          <Link
            to="/marketplace"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Now</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Total Monthly Spend</span>
          <div className="text-2xl font-black text-bazaar-maroon dark:text-bazaar-saffron font-display">
            {formatINR(totalSpent + 2450)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            ↓ 8% lower than hypermarket avg
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Orders Placed</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {orders.length} Orders
          </div>
          <span className="text-[11px] text-stone-400 block">All orders digitally verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Active Shopping Lists</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {plans.length} Lists
          </div>
          <span className="text-[11px] text-bazaar-green font-semibold block">Daily, Weekly & Monthly</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Discovered Nearby Shops</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {shops.length} Stores
          </div>
          <span className="text-[11px] text-bazaar-saffron font-semibold block">Within 5 km radius</span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Spending Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                Weekly Spending Trend (₹)
              </h3>
              <p className="text-xs text-stone-500">Real-time expenditure tracking across registered shops</p>
            </div>
            <span className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron bg-bazaar-maroon/10 px-2.5 py-1 rounded-full">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient id="spendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A263A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7A263A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Amount Spent']} />
                <Area type="monotone" dataKey="amount" stroke="#7A263A" strokeWidth={3} fillOpacity={1} fill="url(#spendColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
              Category Distribution
            </h3>
            <p className="text-xs text-stone-500">Expenditure share by product type</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-stone-700 dark:text-stone-300">{cat.name}</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
            Recent Orders
          </h3>
          <Link to="/orders" className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-bold text-sm block">{ord.id}</span>
                <span className="text-stone-500">{ord.shopName} • {ord.items.length} items</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-stone-900 dark:text-white font-display block">
                  {formatINR(ord.totalAmount)}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  {ord.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

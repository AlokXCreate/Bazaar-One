import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { shops, products, updateShop, qualityReports, updateReportStatus } = useMarketplace();
  const { orders } = useCart();

  const [activeTab, setActiveTab] = useState<'shops' | 'complaints' | 'analytics'>('shops');

  const traditionalShops = shops.filter((s) => s.marketType === 'traditional');
  const modernShops = shops.filter((s) => s.marketType === 'modern');
  const totalPlatformGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const platformVolumeData = [
    { month: 'Jun', gmv: 45000 },
    { month: 'Jul', gmv: 78000 },
    { month: 'Aug', gmv: 110000 },
    { month: 'Sep', gmv: 145000 },
    { month: 'Oct', gmv: 198000 },
    { month: 'Nov', gmv: 245000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-stone-900 to-bazaar-maroon text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex-shrink-0 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">
              Super Admin Console • Platform Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Bazaar One National Control
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Maharashtra Central Region • Superadmin Security Level 1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            All Microservices Operational
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Platform GMV Volume</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-display">
            {formatINR(totalPlatformGMV + 1420000)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">Across 8 registered clusters</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Total Registered Shops</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {shops.length} Stores
          </div>
          <span className="text-[11px] text-stone-400 block">
            {traditionalShops.length} Mandi/Bazaar • {modernShops.length} Retail
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Catalog SKUs</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {products.length} SKUs
          </div>
          <span className="text-[11px] text-stone-400 block">All verified for authentic pricing</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Quality Complaints</span>
          <div className="text-2xl font-black text-rose-600 font-display">
            {qualityReports.length} Reports
          </div>
          <span className="text-[11px] text-stone-400 block">Consumer protection queue</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'shops'
              ? 'bg-purple-900 text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Merchant Management ({shops.length})
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'complaints'
              ? 'bg-purple-900 text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Quality & Trust Complaints ({qualityReports.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'analytics'
              ? 'bg-purple-900 text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Platform Volume Analytics
        </button>
      </div>

      {/* Tab 1: Shops Governance */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            Registered Vendor Review & Verification
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-3.5">Store Details</th>
                  <th className="p-3.5">Market Type</th>
                  <th className="p-3.5">Proprietor</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {shops.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                        />
                        <div>
                          <span>{s.name}</span>
                          <span className="block text-[11px] text-stone-400">
                            {s.address.area}, {s.address.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-semibold text-stone-700 dark:text-stone-300">
                        {s.marketType === 'traditional' ? 'Traditional Mandi' : 'Modern Retail'}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600 dark:text-stone-300">{s.ownerName}</td>
                    <td className="p-3.5 text-stone-500 font-mono">{s.contactNumber}</td>
                    <td className="p-3.5">
                      {s.isVerified ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 w-max block">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => updateShop(s.id, { isVerified: !s.isVerified })}
                        className={`px-3 py-1 rounded-xl font-bold text-xs shadow-sm transition-colors ${
                          s.isVerified
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {s.isVerified ? 'Revoke Badge' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Quality & Trust Complaints */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            Customer Quality Complaints & Investigation
          </h3>

          <div className="space-y-4">
            {qualityReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">
                      {report.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-rose-100 text-rose-800">
                      {report.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-stone-400">Order Ref: {report.orderId}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-600 dark:text-stone-300">
                  <div>
                    <span className="text-stone-400 block">Complainant:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{report.customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Against Store:</span>
                    <span className="font-bold text-bazaar-maroon dark:text-bazaar-saffron">{report.shopName}</span>
                  </div>
                </div>

                <p className="text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  "{report.description}"
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-stone-500">
                    Status: <strong className="uppercase text-purple-600">{report.status}</strong>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved', 'Merchant refund issued')}
                      className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold"
                    >
                      Resolve & Compensate
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'rejected', 'Verification found no weight defect')}
                      className="px-3 py-1 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
            Gross Merchandise Value (GMV) Growth Curve
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformVolumeData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Monthly GMV']} />
                <Bar dataKey="gmv" fill="#581c87" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

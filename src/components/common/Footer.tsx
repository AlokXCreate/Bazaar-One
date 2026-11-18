import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { BazaarLogo } from './BazaarLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-bazaar-saffron mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-bazaar-maroon/30 text-bazaar-saffron flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Local Merchants</h4>
              <p className="text-xs text-stone-400">Authentic Kiranas, Mandis & Retailers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-bazaar-green/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Quality Checked Daily</h4>
              <p className="text-xs text-stone-400">Farm-fresh produce & genuine grains</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-900/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fair Local Pricing</h4>
              <p className="text-xs text-stone-400">Direct mandi rates without hidden markups</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Shopkeeper Call</h4>
              <p className="text-xs text-stone-400">Call or WhatsApp your favorite vendor</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bazaar-maroon flex items-center justify-center p-1">
                <BazaarLogo className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-extrabold font-display text-white">
                BAZAAR<span className="text-bazaar-saffron">ONE</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed pr-6">
              Bazaar One empowers India's vibrant traditional marketplaces alongside modern retail businesses.
              From fresh morning vegetable mandis and neighbourhood Kirana stores to hypermarkets and electronics,
              discover, plan, compare and order with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <MapPin className="w-4 h-4 text-bazaar-saffron" />
              <span>Headquartered in Pune & Mumbai | Supporting Vendors Across India</span>
            </div>
          </div>

          {/* Traditional Bazaar Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-bazaar-saffron pl-2.5">
              Traditional Bazaar
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/marketplace?cat=kirana" className="hover:text-bazaar-saffron transition-colors">Kirana Stores (किराना)</Link></li>
              <li><Link to="/marketplace?cat=vegetables" className="hover:text-bazaar-saffron transition-colors">Fresh Vegetables (भाजीपाला)</Link></li>
              <li><Link to="/marketplace?cat=dairy" className="hover:text-bazaar-saffron transition-colors">Pure Desi Dairy & Ghee</Link></li>
              <li><Link to="/marketplace?cat=spices" className="hover:text-bazaar-saffron transition-colors">Spices & Masalas (खडे मसाले)</Link></li>
              <li><Link to="/marketplace?cat=traditional-snacks" className="hover:text-bazaar-saffron transition-colors">Sweets & Farsan (मिठाई)</Link></li>
              <li><Link to="/marketplace?cat=grains-pulses" className="hover:text-bazaar-saffron transition-colors">Grains & Pulses (डाळ व धान्य)</Link></li>
            </ul>
          </div>

          {/* Modern Marketplace Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Modern Retail
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/marketplace?cat=supermarkets" className="hover:text-emerald-400 transition-colors">Hypermarkets</Link></li>
              <li><Link to="/marketplace?cat=organic" className="hover:text-emerald-400 transition-colors">Certified Organic Store</Link></li>
              <li><Link to="/marketplace?cat=packaged-food" className="hover:text-emerald-400 transition-colors">FMCG & Packaged Foods</Link></li>
              <li><Link to="/marketplace?cat=electronics" className="hover:text-emerald-400 transition-colors">Kitchen Appliances</Link></li>
              <li><Link to="/marketplace?cat=household" className="hover:text-emerald-400 transition-colors">Household Cleaners</Link></li>
              <li><Link to="/marketplace?cat=personal-care" className="hover:text-emerald-400 transition-colors">Personal Care & Grooming</Link></li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-purple-500 pl-2.5">
              Portals & System
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/customer" className="hover:text-white transition-colors">Customer Dashboard</Link></li>
              <li><Link to="/vendor" className="hover:text-white transition-colors">Shopkeeper / Vendor Portal</Link></li>
              <li><Link to="/delivery" className="hover:text-white transition-colors">Delivery Partner Hub</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Super Admin Control</Link></li>
              <li><Link to="/planner" className="hover:text-white transition-colors">Smart Shopping Planner</Link></li>
              <li><Link to="/maps" className="hover:text-white transition-colors">Live Shop Locator</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Indian Cultural Acknowledgement */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-bazaar-saffron fill-bazaar-saffron" />
            <span>for Bharat's Shopkeepers, Farmers, and Families</span>
          </div>
          <div className="text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} Bazaar One Technologies Private Limited. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

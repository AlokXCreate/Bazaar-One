# 🛒 BAZAAR ONE
### **"Your Local Bazaar. Your Modern Marketplace."**

An AI-powered unified marketplace connecting traditional Indian bazaars, neighborhood kirana stores, fresh vegetable mandis, modern retail hypermarkets, delivery fleets, and customers through intelligent shopping, digital payments, live store discovery, and automated shopping budgeting.

---

## 🌟 Overview & Vision

**Bazaar One** bridges traditional Indian commerce culture with modern digital convenience. Traditional Indian bazaars—mornings at the sabzi mandi, neighborhood kiranas offering trusted credit and local pulses, regional spice grinders, and festive sweet stalls—form the economic backbone of Bharat. Bazaar One digitizes this vibrant ecosystem while providing a unified interface alongside modern supermarkets and electronic retail.

---

## 🚀 Key Highlights & Architectural Modules

### 1. Dual Traditional & Modern Marketplace
- **Traditional Bazaar:** Fresh vegetables from farmer collectives, Latur unpolished toor dal, MP Sehore Sharbati wheat, Vedic A2 Gir cow ghee, stone-ground Kolhapuri masalas, and Pune Bakarwadi.
- **Modern Retail:** Hypermarkets, packaged FMCG groceries, branded sunflower oils, detergents, kitchen appliances, and certified Jaivik organic products.
- **Unified Switcher:** Seamlessly switch between Traditional, Modern, or unified hybrid view.
- **Bargain & Quote Request:** Customers can negotiate bulk rates directly with traditional shopkeepers.

### 2. Smart Shopping Planner (Signature Module)
- **Daily Planner:** Checklist for today's kitchen greens, dairy, and morning provisions.
- **Weekly Planner:** Day-by-day family grocery planning (Monday through Sunday) with automatic meal budget estimation.
- **Monthly Planner:** Monthly household bulk essentials, progress expenditure bar, and budget alert thresholds.
- **One-Click Add to Cart:** Instantly transfers all unpurchased list items into the cart.

### 3. Four-Tier Role Architecture
- **Customer Dashboard:** Spending analytics, category breakdown pie charts, recent orders, and preferred stores.
- **Shopkeeper / Vendor Portal:** Real-time revenue metrics, order dispatch manager, catalog inventory manager, low-stock alerts, and quick restock.
- **Delivery Partner Hub:** Assigned runs, pickup store and drop-off coordinates, customer telephone dialer, Google Maps GPS navigation, and earnings ledger.
- **Super Admin Console:** Platform GMV monitoring, merchant verification and suspension, consumer quality complaints arbitration, and microservice status.

### 4. Live Shop Locator & Geolocation
- Real-time store discovery map showing verified traditional mandis and modern retailers.
- Proximity estimation, opening hours, contact numbers, and turn-by-turn navigation.

### 5. Verified Billing & Multi-Format Document Export Engine
Generates official, print-ready, branded records:
- **PDF Documents:** Print-ready tax invoices and inventory reports via `jspdf` and `jspdf-autotable`.
- **Microsoft Word (.DOCX):** Fully editable Word documents via `docx`.
- **Structured JSON:** Valid JSON data export with timestamps and order payloads.
- **Standalone HTML:** Styled, self-contained printable HTML records.

### 6. Bazaar AI Intelligent Shopping Assistant
- Powered by Google Gemini API with intelligent local catalog-aware fallbacks.
- Multilingual support: English, Hindi (हिंदी), and Marathi (मराठी).
- Natural language budget planning (e.g., *"Prepare my monthly grocery list within ₹5,000"*).
- Cross-store rate comparisons and localized vegetable recommendations.

### 7. Real-Time Digital Payments
- **UPI Integration:** Dynamic QR code generation, UPI ID handles, and intent URI schemas.
- **Razorpay Integration:** Full online card, netbanking, and wallet gateway readiness.
- **Cash on Delivery (COD):** Available for verified local orders.

### 8. Product Quality & Consumer Trust
- Formal quality concern filing (weight mismatch, freshness, damaged packaging, expired).
- Administrator investigation queue and merchant dispute resolution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS, Lucide React Icons |
| **Charts & Analytics** | Recharts (AreaChart, PieChart, BarChart) |
| **Routing** | React Router DOM v7 |
| **State & Storage** | React Context API, LocalStorage persistence, Cloud Firestore |
| **Document Generation** | jsPDF, jsPDF-AutoTable, docx, FileSaver |
| **Visual FX** | Canvas Confetti |
| **Backend & Cloud** | Firebase Auth, Cloud Firestore, Firebase Hosting |
| **External APIs** | Google Maps Platform, Google Gemini API, Razorpay Checkout |

---

## 📂 Project Folder Structure

```
Bazaar-One/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── public/
│   └── bazaar-logo.svg          # Official Bazaar One brand logo
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ai/
│   │   │   └── BazaarAIAssistant.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CheckoutModal.tsx
│   │   ├── common/
│   │   │   ├── Badge.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── StarRating.tsx
│   │   ├── documents/
│   │   │   └── DocumentExportModal.tsx
│   │   ├── maps/
│   │   │   └── LiveShopDiscoveryMap.tsx
│   │   ├── marketplace/
│   │   │   ├── BargainQuoteModal.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductQuickViewModal.tsx
│   │   │   ├── ShopCard.tsx
│   │   │   └── TraditionalVsModernToggle.tsx
│   │   ├── planner/
│   │   │   ├── DailyPlannerView.tsx
│   │   │   ├── MonthlyPlannerView.tsx
│   │   │   └── WeeklyPlannerView.tsx
│   │   └── quality/
│   │       └── QualityReportModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── MarketplaceContext.tsx
│   │   ├── PlannerContext.tsx
│   │   └── ToastContext.tsx
│   ├── data/
│   │   ├── initialSeed.ts       # Local storage sync & default accounts
│   │   ├── mockCategories.ts    # Traditional & modern categories
│   │   ├── mockOrders.ts        # Seed orders with fulfillment histories
│   │   ├── mockPlans.ts         # Pre-configured daily/weekly/monthly plans
│   │   ├── mockProducts.ts      # Indian grocery, produce & retail catalog
│   │   └── mockShops.ts         # Verified Pune/Mumbai traditional & modern stores
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboardPage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── customer/
│   │   │   ├── CustomerDashboardPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   └── ShoppingPlannerPage.tsx
│   │   ├── delivery/
│   │   │   └── DeliveryPartnerDashboardPage.tsx
│   │   ├── marketplace/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LiveMapsPage.tsx
│   │   │   ├── MarketplacePage.tsx
│   │   │   └── ShopDetailPage.tsx
│   │   └── vendor/
│   │       └── VendorDashboardPage.tsx
│   ├── services/
│   │   ├── aiService.ts
│   │   ├── documentExportService.ts
│   │   ├── firebase.ts
│   │   └── paymentService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── currency.ts          # INR formatters
│   │   └── formatters.ts        # Date, PIN code, mobile & regional dictionary
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## ⚡ Quick Start & Development

### 1. Clone & Install
```bash
git clone https://github.com/AlokXCreate/Bazaar-One.git
cd Bazaar-One
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate optional API keys:
- `VITE_FIREBASE_API_KEY`: Firebase web API key
- `VITE_GEMINI_API_KEY`: Google Gemini API key for AI assistant
- `VITE_RAZORPAY_KEY_ID`: Razorpay key ID (`rzp_test_...`)
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps JavaScript API key

*Note: The platform is built with an offline-first resilient architecture. When external API keys are omitted, Bazaar One automatically activates its local catalog intelligence engine with zero runtime errors.*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 👥 Demo Role Testing

The top navigation bar includes an instant **Role Switcher** allowing you to test all 4 application experiences:
1. **Customer:** Browse, add to cart, bargain, place orders, download tax invoices, and use the daily/weekly/monthly planner.
2. **Shopkeeper / Vendor:** View sales figures, incoming orders, change order fulfillment status, add products, and manage stock levels.
3. **Delivery Partner:** Inspect assigned pickup and drop runs, customer addresses, phone dialer, and confirm delivery.
4. **Super Admin:** Review registered stores, toggle verification badges, arbitrate quality reports, and view GMV analytics.

---

## 📄 License
Released under the MIT License. Copyright © 2026 Alok Anil Kadam.

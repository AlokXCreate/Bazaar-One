import { Product, Shop } from '../types';

export interface AIResponse {
  message: string;
  suggestedItems?: { name: string; quantity: number; unit: string; estimatedPrice: number; category: string }[];
  suggestedProducts?: Product[];
  suggestedShops?: Shop[];
  detectedIntent?: 'shopping_list' | 'budget_plan' | 'price_comparison' | 'shop_discovery' | 'general';
}

export const aiService = {
  /**
   * Processes user queries through Gemini API (if key present) or intelligent rule-based catalog matcher
   */
  async processQuery(
    prompt: string,
    catalog: Product[],
    shops: Shop[],
    language: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<AIResponse> {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (geminiKey && geminiKey.trim() !== '') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Bazaar AI, an expert Indian grocery, traditional bazaar, and retail shopping assistant for "Bazaar One".
Language: ${language}.
Available products in catalog: ${JSON.stringify(
                        catalog.map((p) => ({ id: p.id, name: p.name, price: p.price, unit: p.unit, shop: p.shopName }))
                      )}.
User asked: "${prompt}".
Help the customer with budget-friendly, realistic suggestions based solely on real Indian staples and available products. Give a warm, helpful response.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const resJson = await response.json();
          const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return {
              message: generatedText,
              detectedIntent: 'general',
              suggestedProducts: catalog.slice(0, 3),
            };
          }
        }
      } catch (e) {
        console.warn('Gemini API request failed, falling back to local Bazaar AI intelligence engine:', e);
      }
    }

    // Local Catalog-Aware Intelligence Engine
    const lower = prompt.toLowerCase();

    // Intent 1: Budget Planning (e.g., "5000", "2000", "budget")
    if (lower.includes('budget') || lower.includes('5000') || lower.includes('2000') || lower.includes('list')) {
      const budgetMatch = prompt.match(/\d+/);
      const budgetVal = budgetMatch ? parseInt(budgetMatch[0], 10) : 2500;

      const items = [
        { name: 'Sharbati Whole Wheat (5kg)', quantity: 5, unit: 'kg', estimatedPrice: 260, category: 'grains-pulses' },
        { name: 'Unpolished Toor Dal (2kg)', quantity: 2, unit: 'kg', estimatedPrice: 330, category: 'grains-pulses' },
        { name: 'Fortune Refined Sunflower Oil (2L)', quantity: 2, unit: 'L', estimatedPrice: 276, category: 'packaged-food' },
        { name: 'Nashik Red Onions (3kg)', quantity: 3, unit: 'kg', estimatedPrice: 114, category: 'vegetables' },
        { name: 'Himachal Baby Potatoes (2kg)', quantity: 2, unit: 'kg', estimatedPrice: 84, category: 'vegetables' },
        { name: 'Kolhapur Kanda Lasun Masala (250g)', quantity: 1, unit: 'packet', estimatedPrice: 180, category: 'spices' },
        { name: 'Gir Cow Vedic A2 Ghee (1L)', quantity: 1, unit: 'L', estimatedPrice: 1450, category: 'dairy' },
      ];

      const totalEst = items.reduce((s, i) => s + i.estimatedPrice, 0);

      const localizedMsg = {
        en: `Here is a curated shopping plan balancing traditional staples and modern groceries totaling ₹${totalEst}. You can directly add these to your Shopping Planner with one click!`,
        hi: `यहाँ आपके लिए पारंपरिक और आधुनिक किराना का संतुलित शॉपिंग प्लान तैयार किया गया है (कुल अनुमानित ₹${totalEst})। आप इसे एक क्लिक में अपनी योजना में जोड़ सकते हैं।`,
        mr: `येथे तुमच्यासाठी उत्तम दर्जाच्या किराणा आणि भाजीपाल्याची तयार केलेली यादी आहे (एकूण अंदाजे ₹${totalEst}). तुम्ही एका क्लिकवर ही यादी प्लॅनरमध्ये जोडू शकता.`,
      }[language];

      return {
        message: localizedMsg,
        suggestedItems: items,
        detectedIntent: 'budget_plan',
      };
    }

    // Intent 2: Price comparison (e.g. "rice", "oil", "ghee", "wheat", "turmeric")
    if (lower.includes('compare') || lower.includes('price') || lower.includes('rate')) {
      const matches = catalog.filter((p) =>
        lower.includes(p.name.toLowerCase()) ||
        (p.regionalName && lower.includes(p.regionalName.toLowerCase())) ||
        p.tags.some((t) => lower.includes(t))
      );

      const targetList = matches.length > 0 ? matches : catalog.slice(0, 4);

      return {
        message: `I have compared the prices across verified vendors in Bazaar One. Traditional mandi vendors offer wholesale rates on bulk grains, while modern retail offers packaged loyalty discounts.`,
        suggestedProducts: targetList,
        detectedIntent: 'price_comparison',
      };
    }

    // Intent 3: Fresh vegetables or local shop discovery
    if (lower.includes('vegetable') || lower.includes('sabzi') || lower.includes('shop') || lower.includes('near')) {
      const vegShops = shops.filter((s) => s.category === 'vegetables' || s.marketType === 'traditional');
      return {
        message: `We found ${vegShops.length} verified traditional vendors offering fresh morning produce harvested directly from regional farms.`,
        suggestedShops: vegShops,
        detectedIntent: 'shop_discovery',
      };
    }

    // Default friendly assistant response
    return {
      message:
        language === 'mr'
          ? `नमस्कार! मी बाजार वन (Bazaar One) चा AI सहाय्यक आहे. मी तुम्हाला रोजचा किराणा, आठवड्याची खरेदी, किंमतींची तुलना आणि जवळची दुकाने शोधण्यात मदत करू शकतो.`
          : language === 'hi'
          ? `नमस्ते! मैं बाज़ार वन (Bazaar One) का AI असिस्टेंट हूँ। मैं आपको रोज़ाना किराना, बजट प्लानिंग, और नज़दीकी दुकानों से ताज़ा सामान ढूंढने में मदद कर सकता हूँ।`
          : `Hello! I am Bazaar AI, your smart shopping companion for Bazaar One. I can assist you with budget grocery planning, price comparisons between traditional and modern stores, and finding verified local vendors!`,
      detectedIntent: 'general',
      suggestedProducts: catalog.slice(0, 3),
    };
  },
};

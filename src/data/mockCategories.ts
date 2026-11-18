export interface CategoryItem {
  id: string;
  name: string;
  regionalName: string;
  marketType: 'traditional' | 'modern';
  icon: string;
  description: string;
}

export const TRADITIONAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'kirana',
    name: 'Kirana Stores',
    regionalName: 'किराना दुकान (Kirana)',
    marketType: 'traditional',
    icon: 'Store',
    description: 'Local daily grocery, pulses, oils, spices and provisions',
  },
  {
    id: 'vegetables',
    name: 'Fresh Vegetables',
    regionalName: 'ताजी भाजीपाला (Taza Sabzi)',
    marketType: 'traditional',
    icon: 'Carrot',
    description: 'Direct farm-fresh greens, roots and seasonal vegetables',
  },
  {
    id: 'fruits',
    name: 'Fresh Fruits',
    regionalName: 'ताजी फळे (Taza Phal)',
    marketType: 'traditional',
    icon: 'Apple',
    description: 'Fresh seasonal mangoes, bananas, pomegranates & citrus',
  },
  {
    id: 'dairy',
    name: 'Dairy & Milk Products',
    regionalName: 'डेअरी आणि दूध उत्पादने',
    marketType: 'traditional',
    icon: 'Milk',
    description: 'Fresh cow/buffalo milk, pure desi ghee, paneer & butter',
  },
  {
    id: 'grains-pulses',
    name: 'Grains & Pulses',
    regionalName: 'धान्य आणि डाळी (Dal & Anaj)',
    marketType: 'traditional',
    icon: 'Wheat',
    description: 'Basmati rice, toor dal, moong, chana, wheat flour & millets',
  },
  {
    id: 'spices',
    name: 'Spices & Masalas',
    regionalName: 'मसाले आणि खडे मसाले',
    marketType: 'traditional',
    icon: 'Flame',
    description: 'Pure turmeric, cumin, mustard, cardamom, cloves & garam masala',
  },
  {
    id: 'traditional-clothing',
    name: 'Traditional Attire',
    regionalName: 'पारंपरिक वस्त्र (Khadi & Silk)',
    marketType: 'traditional',
    icon: 'Shirt',
    description: 'Paithani sarees, khadi kurtas, dhotis & ethnic wear',
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts & Clayware',
    regionalName: 'हस्तकला आणि मातीची भांडी',
    marketType: 'traditional',
    icon: 'Palette',
    description: 'Terracotta pots, brass diyas, wooden crafts & festive decor',
  },
  {
    id: 'flowers',
    name: 'Flowers & Garlands',
    regionalName: 'फुले आणि हार (Phool Mandi)',
    marketType: 'traditional',
    icon: 'Sparkles',
    description: 'Marigold garlands, mogra, jasmine & puja floral offerings',
  },
  {
    id: 'traditional-snacks',
    name: 'Traditional Sweets & Snacks',
    regionalName: 'मिठाई आणि फरसाण (Mithai & Farsan)',
    marketType: 'traditional',
    icon: 'Coffee',
    description: 'Chivda, ladoo, pedha, modak, chakli and freshly fried snacks',
  },
  {
    id: 'puja-samagri',
    name: 'Puja Samagri',
    regionalName: 'पूजा साहित्य (Puja Essentials)',
    marketType: 'traditional',
    icon: 'Sun',
    description: 'Incense, camphor, kumkum, sacred thread and rituals kits',
  },
];

export const MODERN_CATEGORIES: CategoryItem[] = [
  {
    id: 'supermarkets',
    name: 'Supermarkets',
    regionalName: 'सुपरमार्केट',
    marketType: 'modern',
    icon: 'ShoppingBag',
    description: 'One-stop retail shopping with branded provisions',
  },
  {
    id: 'packaged-food',
    name: 'Packaged Food & Beverages',
    regionalName: 'पॅकेज्ड अन्न व पेये',
    marketType: 'modern',
    icon: 'Cookie',
    description: 'Biscuits, noodles, beverages, breakfast cereals & ready-to-eat',
  },
  {
    id: 'personal-care',
    name: 'Personal Care & Hygiene',
    regionalName: 'व्यक्तिगत स्वच्छता व सौंदर्य',
    marketType: 'modern',
    icon: 'Sparkle',
    description: 'Soaps, shampoos, skincare, oral care & grooming',
  },
  {
    id: 'household',
    name: 'Household & Cleaning',
    regionalName: 'घरगुती स्वच्छता व उत्पादने',
    marketType: 'modern',
    icon: 'Home',
    description: 'Detergents, floor cleaners, kitchenware & disposables',
  },
  {
    id: 'electronics',
    name: 'Smart Electronics & Appliances',
    regionalName: 'इलेक्ट्रॉनिक्स आणि उपकरणे',
    marketType: 'modern',
    icon: 'Tv',
    description: 'Kitchen blenders, electric kettles, gadgets & power accessories',
  },
  {
    id: 'organic',
    name: 'Certified Organic Store',
    regionalName: 'प्रमाणित सेंद्रिय उत्पादने',
    marketType: 'modern',
    icon: 'Leaf',
    description: 'Chemical-free organic cold-pressed oils, millets & snacks',
  },
];

export const ALL_CATEGORIES = [...TRADITIONAL_CATEGORIES, ...MODERN_CATEGORIES];

/**
 * Date and general formatters for Bazaar One
 */

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Validates 10-digit Indian mobile numbers
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Validates 6-digit Indian PIN codes
 */
export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Common regional product terms dictionary (English <-> Hindi / Marathi)
 */
export const REGIONAL_DICTIONARY: Record<string, { hi: string; mr: string }> = {
  rice: { hi: 'चावल (Chawal)', mr: 'तांदूळ (Tandul)' },
  wheat: { hi: 'गेहूं (Gehun)', mr: 'गहू (Gahu)' },
  turmeric: { hi: 'हल्दी (Haldi)', mr: 'हळद (Halad)' },
  onion: { hi: 'प्याज़ (Pyaz)', mr: 'कांदा (Kanda)' },
  potato: { hi: 'आलू (Aloo)', mr: 'बटाटा (Batata)' },
  tomato: { hi: 'टमाटर (Tamatar)', mr: 'टोमॅटो (Tomato)' },
  milk: { hi: 'दूध (Doodh)', mr: 'दूध (Doodh)' },
  ghee: { hi: 'देसी घी (Desi Ghee)', mr: 'तूप (Toop)' },
  jaggery: { hi: 'गुड़ (Gud)', mr: 'गूळ (Gul)' },
  oil: { hi: 'तेल (Tel)', mr: 'तेल (Tel)' },
  coriander: { hi: 'धनिया (Dhaniya)', mr: 'कोथिंबीर (Kothimbir)' },
  spinach: { hi: 'पालक (Palak)', mr: 'पालक (Palak)' },
  banana: { hi: 'केला (Kela)', mr: 'केळी (Keli)' },
  mango: { hi: 'आम (Aam)', mr: 'आंबा (Amba)' },
};

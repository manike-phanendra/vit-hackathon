// Crop Theme Registry & Background Images for KrishiShield
// Maps farmer crop types to verified agricultural crop field images (Paddy, Cotton, Groundnut, Maize).

export const CROP_THEME_MAP = {
  Paddy: {
    name: "Paddy (Rice)",
    emoji: "🌾",
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    overlayGradient: "from-emerald-950/95 via-green-950/90 to-agri-dark/95",
    headerBg: "from-emerald-900/80 via-agri-900/90 to-emerald-950/95",
    cardBorder: "border-emerald-500/50",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    accentHex: "#10b981",
    soilType: "Clay Loam & Alluvial Soil",
    growthStage: "Panicle Initiation & Flowering",
    tagline: "Monsoon Deficit & Dry-Spell Protection Shield",
    description: "Monitors daily precipitation, 0-10cm soil moisture indices, and vegetative satellite coverage.",
    iconBg: "bg-emerald-500/20 text-emerald-400"
  },
  Cotton: {
    name: "Cotton (Kapas)",
    emoji: "☁️",
    bgImage: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80",
    overlayGradient: "from-slate-950/95 via-indigo-950/90 to-agri-dark/95",
    headerBg: "from-indigo-900/80 via-slate-900/90 to-indigo-950/95",
    cardBorder: "border-indigo-500/50",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    accentHex: "#6366f1",
    soilType: "Deep Black Cotton Soil (Vertisol)",
    growthStage: "Boll Formation & Maturation",
    tagline: "Severe Rainfall Deficit & Crop Damage Shield",
    description: "Monitors humidity levels, monsoon break duration, and optical satellite leaf moisture.",
    iconBg: "bg-indigo-500/20 text-indigo-400"
  },
  Groundnut: {
    name: "Groundnut (Peanut)",
    emoji: "🥜",
    bgImage: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80",
    overlayGradient: "from-amber-950/95 via-yellow-950/90 to-agri-dark/95",
    headerBg: "from-amber-900/80 via-stone-900/90 to-amber-950/95",
    cardBorder: "border-amber-500/50",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    accentHex: "#f59e0b",
    soilType: "Red Sandy Loam Soil",
    growthStage: "Pegging & Pod Development",
    tagline: "Red Sandy Soil Moisture Deficit Insurance",
    description: "Tracks ground surface soil moisture levels, thermal radiation, and consecutive dry days.",
    iconBg: "bg-amber-500/20 text-amber-400"
  },
  Maize: {
    name: "Maize (Corn)",
    emoji: "🌽",
    bgImage: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1600&q=80",
    overlayGradient: "from-yellow-950/95 via-amber-950/90 to-agri-dark/95",
    headerBg: "from-yellow-900/80 via-amber-900/90 to-yellow-950/95",
    cardBorder: "border-yellow-500/50",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    accentHex: "#eab308",
    soilType: "Deep Well-Drained Silt Loam",
    growthStage: "Tasseling & Cob Formation",
    tagline: "Dry-Spell & Heat Wave Parametric Coverage",
    description: "Monitors heat degree days, soil moisture evaporation, and dry spell durations.",
    iconBg: "bg-yellow-500/20 text-yellow-400"
  }
};

/**
 * Matches any crop name to Paddy, Cotton, Groundnut, or Maize.
 */
export function getCropTheme(cropName) {
  if (!cropName) return CROP_THEME_MAP.Paddy;
  const clean = cropName.toLowerCase().trim();
  if (clean.includes('cotton') || clean.includes('kapas')) return CROP_THEME_MAP.Cotton;
  if (clean.includes('groundnut') || clean.includes('peanut')) return CROP_THEME_MAP.Groundnut;
  if (clean.includes('maize') || clean.includes('corn')) return CROP_THEME_MAP.Maize;
  
  // Default fallback to Paddy
  return CROP_THEME_MAP.Paddy;
}

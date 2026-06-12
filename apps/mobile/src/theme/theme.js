export const COLORS = {
  bg: "#0B0C1A",
  bgElevated: "#0F1024",
  card: "#13142A",
  cardHover: "#1A1B38",
  cardBorder: "#252650",
  cardBorderLight: "#2D2E5A",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
  goldDim: "#8A7430",
  white: "#FFFFFF",
  muted: "#7878A0",
  mutedLight: "#A0A0C0",
  accent: "#1E1F3A",
  success: "#4A8C5C",
  danger: "#E05555",
  overlay: "rgba(11, 12, 26, 0.85)",

  parchment: "#F5E6C8",
  parchmentDark: "#E8D5A8",
  parchmentEdge: "#C4A060",
  manuscriptBg: "#1A1530",
  manuscriptBorder: "#6A5ACD",
  sealRed: "#8B0000",
  inkBrown: "#2A1A0A",
  inkGold: "#B8860B",
  gemBlue: "#1E3A5F",
  gemRuby: "#722F37",
  gemEmerald: "#2E5C3E",
  ornamentBorder: "#8B7355",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  gold: {
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  manuscript: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  parchment: {
    shadowColor: COLORS.parchmentEdge,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
};
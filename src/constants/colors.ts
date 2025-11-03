export const AVATAR_COLORS = [
  '#1DA1F2', // Twitter blue
  '#F91880', // Hot pink
  '#794BC4', // Purple
  '#17BF63', // Green
  '#FD9F28', // Orange
  '#E0245E', // Red
  '#FFAD1F', // Yellow
  '#00BA7C', // Teal
  '#7856FF', // Indigo
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquoise
] as const;

export const getColorFromLetter = (letter: string): string => {
  const charCode = letter.toUpperCase().charCodeAt(0);
  const index = charCode % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

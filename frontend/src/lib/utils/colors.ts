const colors = ["bg-red-500", "bg-blue-600"];

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};

export const getRandomColor = (str: string) => {
  const hash = hashString(str);
  const randomIndex = Math.abs(hash) % colors.length;
  const color = colors[randomIndex];
  return color;
};

export const colorTheme = {
  primary: "bg-classicTrustworthy-primary",
  secondary: "bg-classicTrustworthy-secondary",
  accent: "bg-classicTrustworthy-accent",
  neutral: "bg-classicTrustworthy-neutral",
  bg: "bg-classicTrustworthy-bg",
  text: "text-classicTrustworthy-text",
  textPrimary: "text-classicTrustworthy-primary",
  textNeutral: "text-classicTrustworthy-neutral",
};

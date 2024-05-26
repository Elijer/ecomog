export const generateRandomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

export const generateRed = () => {
  const redHex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${redHex}0000`;
}

export const clamp = (value, min, max)=>  {
  return Math.max(min, Math.min(max, value));
}
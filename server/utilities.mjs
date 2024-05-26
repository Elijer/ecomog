export const generatePlayerColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

export const generateRed = () => {
  const redHex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${redHex}0000`;
}
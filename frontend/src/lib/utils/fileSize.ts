export const formatSizeInBytes = (size: number) => {
  const sizes = ["Bytes", "KB", "MB"];
  let i = 0;
  while (size > 1024 && i < 3) {
    size = size / 1024;
    i++;
  }
  return `${size.toFixed(2)}${sizes[i]}`;
};

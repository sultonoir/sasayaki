function formatNumber(n: number): string {
  if (n < 1000) return n.toString();

  const units = ["", "k", "m", "b", "t"];
  let index = 0;

  while (n >= 1000) {
    n /= 1000;
    index++;
  }

  return `${n.toFixed(0)}${units[index]}`;
}

export const counter = (n: number) => {
  return formatNumber(n);
};

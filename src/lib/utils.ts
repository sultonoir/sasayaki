import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getWsUrl() {
  if (process.env.NODE_ENV === "development") {
    return "ws://localhost:3001";
  }
  if (process.env.NEXT_PUBLIC_SERVER_WS_URL) {
    return process.env.NEXT_PUBLIC_SERVER_WS_URL;
  }
  return `ws://localhost:3001`;
}

function getApiUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL;
  }
  return `http://localhost:3001`;
}

export const wsURL = getWsUrl();

export const serverURL = getApiUrl();

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

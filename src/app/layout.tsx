import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Provider } from "@/provider/provider";

const interSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s • Meseji",
    default: "Meseji",
  },
  description: "Quickly send and receive messages directly from your computer.",
  icons: [{ rel: "icon", url: "/logo.png" }],
  metadataBase: new URL("https://meseji.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    title: {
      template: "%s • Meseji",
      default: "Meseji",
    },
    description:
      "Quickly send and receive messages directly from your computer.",
    url: "https://meseji.vercel.app/",
    siteName: "sultonoir-chat",
    images: [
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: {
      template: "%s • Meseji",
      default: "Meseji",
    },
    site: "https://meseji.vercel.app/",
    description:
      "Quickly send and receive messages directly from your computer.",
    images: [
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        suppressHydrationWarning>
        <body className={`${interSans.className} antialiased`}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

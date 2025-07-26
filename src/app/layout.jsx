import "./global.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "beyond log",
  description: "Shadowverse Worlds Beyond 戦績記録アプリ",
  metadataBase: new URL("https://beyond-log.vercel.app/"),
  openGraph: {
		title: "beyond log",
    description: "シャドバWBの戦績を簡単管理。グラフで傾向分析。",
    url: "https://beyond-log.vercel.app/",
    siteName: "beyond log",
    locale: "ja_JP",
    type: "website",
		images: [
      {
        url: "https://beyond-log.vercel.app/ogp.png",
        width: 1200,
        height: 630,
        alt: "beyond log サムネイル",
      },
    ],
  },
  twitter: {
		card: "summary_large_image",
    title: "beyond log",
    description: "シャドバWB戦績管理アプリ",
		images: ["https://beyond-log.vercel.app/ogp.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

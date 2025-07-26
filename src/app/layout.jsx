import "./global.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "beyond log",
  description: "Shadowverse Worlds Beyond 戦績記録アプリ",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "beyond log",
    description: "シャドバの戦績を簡単管理。グラフで傾向分析。",
    url: "https://example.com",
    siteName: "beyond log",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "beyond log",
    description: "シャドバ戦績管理・勝率可視化アプリ",
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

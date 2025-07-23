import Footer from "./components/Footer";
import Header from "./components/Header";
import "./global.css";

export const metadata = {
  title: "シャドバログ",
  description: "Shadowverse Worlds Beyond 戦績記録アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body>
        <div style={{ paddingBottom: "64px" }}>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

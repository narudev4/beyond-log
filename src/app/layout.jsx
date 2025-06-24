import { Box, Grid } from "@mui/material";
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
        <Box sx={{ flexGrow: 1 }}>
          <Header />
          {children}
          <Footer />
        </Box>
      </body>
    </html>
  );
}

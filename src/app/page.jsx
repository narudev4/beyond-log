"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "./lib/firebaseAuth";
import logo from "../../public/logo.png";
import { auth } from "./lib/firebase";

const HomePage = () => {
  const router = useRouter();

  return (
    <Box
      component="main"
      sx={{
        height: "calc(100vh - 40px)",
        pt: "64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Image src={logo} alt="サイトロゴ" width={350} />

      <Typography variant="h6" mt={0}>
        シャドウバースの対戦記録を簡単に管理
        <br />
        デッキごとの勝率や先後勝率を自動で可視化
        <br />
        今すぐ記録を始めてみましょう。
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={2}>
        Googleアカウントでログインすれば、
        <br />
        戦績を保存できて複数端末で引き継ぎ可能。
        <br />
        今後は、X(旧Twitter)で勝率を共有できる機能も追加予定です！
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/dashboard")}
        >
          いますぐはじめる
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            if (auth.currentUser) {
              router.push("/dashboard");
            } else {
              loginWithGoogle(router);
            }
          }}
          sx={{ textTransform: "none" }}
        >
          Googleログインで始める
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage;

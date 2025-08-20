"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Link,
  Avatar,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";

import { auth } from "../lib/firebase";
import { loginWithGoogle, logout } from "../lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

import icon from "../../../public/icon.png";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "grey.200", color: "black" }}
      elevation={0}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link
            component={NextLink}
            href="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Image src={icon} alt="アプリアイコン" width={32} height={32} />
              <Typography variant="h6">beyond log</Typography>
            </Box>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {user ? (
            <>
              <Avatar src={user.photoURL ?? undefined} sx={{ width: 30, height: 30 }} />
              <Button
                color="inherit"
                onClick={() => {
                  const confirmed = window.confirm("ログアウトしますか？");
                  if (confirmed) {
                    logout();
                  }
                }}
              >
                ログアウト
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => loginWithGoogle(router)}>
              ログイン
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

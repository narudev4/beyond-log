"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
	Button,
  Typography,
  Box,
	Link,
} from "@mui/material";
import NextLink from "next/link";

const Header = () => {
	const [user, setUser] = useState(null);
	const handleLogin = () => {
	alert("ログイン処理（仮）");
	setUser(null);
	}
  return (
    <AppBar position="static" sx={{ backgroundColor: "grey.200", color: "black"}} elevation={0}>
			<Toolbar>
				<Typography sx={{ flexGrow: 1 }}>
					<Link component={NextLink} href="/dashboard" style={{ textDecoration: "none", color: "inherit"}}>Beyond Log</Link>
				</Typography>
				<Box>
					{user ? (
						<Button color="inherit" onClick={handleLogin}>ログアウト</Button>
					):(
						<Button color="inherit" onClick={handleLogin}>ログイン</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
  );
};

export default Header;

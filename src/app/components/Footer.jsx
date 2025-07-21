"use client";
import { Box, Typography, Stack, Link } from "@mui/material";
import NextLink from "next/link";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
				position: "fixed",
        bottom: 0,
				left: 0,
				width: "100%",
        backgroundColor: "grey.200",
        color: "black",
        py: 1,
				zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Link href="/terms" underline="hover" color="inherit">
          利用規約
        </Link>
        <Link href="/contact" underline="hover" color="inherit">
          お問い合わせ
        </Link>
        <Link component={NextLink} href="/dashboard" underline="hover" color="inherit">© 2025 Beyond Log</Link>
        <Typography variant="body2">v beta</Typography>
      </Stack>
    </Box>
  );
};

export default Footer;

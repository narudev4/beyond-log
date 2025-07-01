"use client";
import { Box, Typography, Stack, Link } from "@mui/material";

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
        <Link href="#" underline="hover" color="inherit">
          利用規約（準備中）
        </Link>
        <Link href="#" underline="hover" color="inherit">
          お問い合わせ（準備中）
        </Link>
        <Typography variant="body2">© 2025 Beyond Log</Typography>
        <Typography variant="body2">v beta</Typography>
      </Stack>
    </Box>
  );
};

export default Footer;

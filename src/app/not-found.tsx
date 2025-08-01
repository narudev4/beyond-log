"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "calc(100vh - 40px)"}}
    >
      <Typography variant="h3" gutterBottom>
        404 - ページが見つかりません
      </Typography>
      <Typography variant="body1" gutterBottom>
        お探しのページは存在しないか、移動された可能性があります。
      </Typography>
      <Link href="/">
        <Button variant="contained" sx={{ mt: 2 }}>
          ホームへ戻る
        </Button>
      </Link>
    </Box>
  );
}
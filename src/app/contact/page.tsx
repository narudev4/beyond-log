"use client";
import { Container, Typography, Link, Box } from "@mui/material";

const ContactPage = () => {
  return (
    <Container maxWidth="sm" sx={{ p: 2, marginTop: "64px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        お問い合わせ
      </Typography>

      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        このアプリに関するご意見・ご質問・バグ報告などは、以下のいずれかの方法でご連絡ください。
      </Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="body2">
          メール：
          <Link href="mailto:yourname@example.com" underline="hover">
            narudev4@gmail.com
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          X（旧Twitter）：
          <Link href="https://twitter.com/narudev4" target="_blank" underline="hover">
            @narudev4
          </Link>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary">
        通常1〜3日以内に返信いたします（返信を保証するものではありません）。
      </Typography>
    </Container>
  );
};

export default ContactPage;
"use client";
import { Box, Typography, Container } from "@mui/material";

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        利用規約
      </Typography>

      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        このアプリは個人による開発およびポートフォリオ用途で公開されています。<br />
        ご利用にあたっては、以下の内容にご同意いただいたものとみなします。
      </Typography>

      <Typography variant="body2" component="p" sx={{ mb: 2 }}>
        ・アプリの内容や機能について、正確性・完全性・有用性を保証するものではありません。
      </Typography>
      <Typography variant="body2" component="p" sx={{ mb: 2 }}>
        ・ご利用によって生じた損害について、開発者は一切の責任を負いません。
      </Typography>
      <Typography variant="body2" component="p" sx={{ mb: 2 }}>
        ・予告なく内容の変更、またはサービスの提供を終了する場合があります。
      </Typography>
      <Typography variant="body2" component="p" sx={{ mb: 2 }}>
        ・本アプリに関するお問い合わせは、お問い合わせページまたはSNS等をご利用ください。
      </Typography>

      <Typography variant="body1" sx={{ mt: 4 }}>
        最終更新日: 2025年7月21日
      </Typography>
    </Container>
  );
};

export default TermsPage;
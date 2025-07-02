import { Box, Grid, Typography } from "@mui/material";

// props：全対戦データ(matches)・選択中のデッキId（selectDeckId）
const MatchHistory = ({ matches, selectDeckId }) => {
	// 選択中のデッキIdに一致するデッキの戦績だけを抽出する
  const filteredMatches = matches.filter(
    (match) => match.deckId === selectDeckId).reverse();

  return (
    <Box component="section" sx={{ width:"100%" }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1 }}
      >
        対戦履歴
      </Typography>
      <Grid
        sx={{
          height: "calc(100vh - 160px)", // ヘッダーなどの上の高さを差し引く
          overflowY: "auto", // 縦スクロールを有効にする
          p: 2,
          bgcolor: "grey.50",
          maxHeight: "350px",
					width:"100%"
        }}
      >
        {/*デッキ未選択："デッキを選択すると戦績が表示されます"を表示
				デッキ選択中・履歴なし："このデッキの対戦履歴はありません"を表示
				デッキ選択中・履歴あり：履歴をリストで表示する
				 */}
        {!selectDeckId ? (
          <Typography variant="body2" color="text.secondary">
            デッキを選択すると戦績が表示されます
          </Typography>
        ) : filteredMatches.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            このデッキの対戦履歴はありません
          </Typography>
        ) : (
          filteredMatches.map((match) => (
            <Box
              key={match.id}
              sx={{ mb: 1, borderBottom: "1px solid #ddd", pb: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                vs {match.opponentDeck}
              </Typography>
              <Typography variant="body2">
                {match.wentFirst ? "先行" : "後攻"} /{" "}
                {match.result === "win" ? "勝利" : "敗北"} / {match.date}
                {match.memo && (
                  <Typography variant="caption" color="text.secondary">
                    {" "} メモ: {match.memo}
                  </Typography>
                )}
              </Typography>
            </Box>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MatchHistory;

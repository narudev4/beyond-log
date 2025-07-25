import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const STORAGE_KEY = "matchResult";
// props：全対戦データ(matches)・選択中のデッキId（selectDeckId）
const MatchHistory = ({ matches, selectDeckId, onDeleteMatch }) => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [editMatchId, setEditMatchId] = useState(null);
  const [editData, setEditData] = useState({
    opponentDeck: "",
    opponentClass: "",
    wentFirst: true,
    result: "win",
    memo: "",
  });
  const uniqueMatches = Array.from(
    new Map(matches.map((m) => [m.id, m])).values()
  );
  const deckMatches = uniqueMatches.filter((match) => match.deckId === selectDeckId);
  // 選択中のデッキIdに一致するデッキの戦績だけを抽出する
  const filteredMatches = deckMatches
    .filter(
      (match) => selectedClass === "all" || match.opponentDeck === selectedClass
    )
    .reverse();
  // 		console.log("全matches:", matches);
  // console.log("現在選択中のdeckId:", selectDeckId);
  // console.log("filter結果:", filteredMatches);
  // console.table(filteredMatches.map((m) => ({ id: m.id, opponent: m.opponentDeck })));

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1 }}
      >
        対戦履歴
      </Typography>
      {selectDeckId && (
        <FormControl fullWidth size="small" sx={{ my: 1 }}>
          <InputLabel>対戦クラスで絞り込み</InputLabel>
          <Select
            value={selectedClass}
            label="対戦クラスで絞り込み"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="all">全て</MenuItem>
            <MenuItem value="エルフ">エルフ</MenuItem>
            <MenuItem value="ロイヤル">ロイヤル</MenuItem>
            <MenuItem value="ウィッチ">ウィッチ</MenuItem>
            <MenuItem value="ドラゴン">ドラゴン</MenuItem>
            <MenuItem value="ナイトメア">ナイトメア</MenuItem>
            <MenuItem value="ビショップ">ビショップ</MenuItem>
            <MenuItem value="ネメシス">ネメシス</MenuItem>
          </Select>
        </FormControl>
      )}
      <Grid
        sx={{
          height: "calc(100vh - 160px)", // ヘッダーなどの上の高さを差し引く
          overflowY: "auto", // 縦スクロールを有効にする
          p: 2,
          bgcolor: "grey.50",
          maxHeight: "350px",
          width: "100%",
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
                    {" "}
                    メモ: {match.memo}
                  </Typography>
                )}
              </Typography>
              <Button
                onClick={() => {
                  if (window.confirm("この対戦を削除しますか？")) {
                    onDeleteMatch(match.id);
                  }
                }}
                color="error"
                size="small"
                type="button"
                sx={{
                  fontSize: "0.8rem",
                }}
              >
                この対戦を削除
              </Button>
            </Box>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MatchHistory;

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
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useState } from "react";
import { updateMatchInFirestore } from "../lib/firebaseUtils";

const CLASS_OPTIONS = [
  "エルフ",
  "ロイヤル",
  "ウィッチ",
  "ドラゴン",
  "ナイトメア",
  "ビショップ",
  "ネメシス",
];

const MatchHistory = ({ matches, selectDeckId, onDeleteMatch, onUpdateMatch }) => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [editMatchId, setEditMatchId] = useState(null);
  const [editData, setEditData] = useState({
    opponentDeck: "",
    opponentClass: "",
    wentFirst: true,
    result: "win",
    memo: "",
  });

  const handleEdit = (match) => {
    setEditMatchId(match.id);
    setEditData({
      opponentDeck: match.opponentDeck || "",
      wentFirst: match.wentFirst,
      result: match.result,
      memo: match.memo || "",
    });
  };

  const handleSave = async (matchId) => {
    try {
      await updateMatchInFirestore(matchId, editData);
			onUpdateMatch({ id: matchId, ...editData })
      setEditMatchId(null);
    } catch (err) {
      console.error("Firestore更新エラー:", err);
      alert("戦績の編集に失敗しました");
    }
  };

  const uniqueMatches = Array.from(
    new Map(matches.map((m) => [m.id, m])).values()
  );
  const deckMatches = uniqueMatches.filter(
    (match) => match.deckId === selectDeckId
  );
  const filteredMatches = deckMatches
    .filter(
      (match) => selectedClass === "all" || match.opponentDeck === selectedClass
    )
    .reverse();

  return (
    <Box component="section" sx={{ width: "100%"}}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1 }}
      >
        対戦履歴
      </Typography>
      {selectDeckId && (
        <FormControl fullWidth size="small" sx={{ mt: "24px", px:"4px"}}>
          <InputLabel>対戦クラスで絞り込み</InputLabel>
          <Select
            value={selectedClass}
            label="対戦クラスで絞り込み"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="all">全て</MenuItem>
            {CLASS_OPTIONS.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Grid sx={{ maxHeight: "350px", overflowY: "auto", p: 2 }}>
        {filteredMatches.length === 0 ? (
          <Typography color="text.secondary">履歴がありません</Typography>
        ) : (
          filteredMatches.map((match) => (
            <Box key={match.id} sx={{ mb: 2, borderBottom: "1px solid #ccc" }}>
              {editMatchId === match.id ? (
                <>
                  <FormControl fullWidth size="small" sx={{ my: 1 }}>
                    <InputLabel>対戦相手クラス</InputLabel>
                    <Select
                      value={editData.opponentDeck}
                      label="対戦相手クラス"
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          opponentDeck: e.target.value,
                        }))
                      }
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <MenuItem key={cls} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormLabel sx={{ mt: 1 }}>先攻 or 後攻</FormLabel>
                  <RadioGroup
                    row
                    value={editData.wentFirst ? "先行" : "後攻"}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        wentFirst: e.target.value === "先行",
                      }))
                    }
                  >
                    <FormControlLabel
                      value="先行"
                      control={<Radio />}
                      label="先行"
                    />
                    <FormControlLabel
                      value="後攻"
                      control={<Radio />}
                      label="後攻"
                    />
                  </RadioGroup>

                  <FormLabel sx={{ mt: 2 }}>勝敗</FormLabel>
                  <RadioGroup
                    row
                    value={editData.result}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        result: e.target.value,
                      }))
                    }
                  >
                    <FormControlLabel
                      value="win"
                      control={<Radio />}
                      label="勝利"
                    />
                    <FormControlLabel
                      value="lose"
                      control={<Radio />}
                      label="敗北"
                    />
                  </RadioGroup>

                  <TextField
                    fullWidth
                    label="メモ"
                    size="small"
                    value={editData.memo}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        memo: e.target.value,
                      }))
                    }
                    sx={{ my: 1 }}
                  />

                  <Button
                    onClick={() => handleSave(match.id)}
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    保存
                  </Button>
                  <Button onClick={() => setEditMatchId(null)} size="small">
                    キャンセル
                  </Button>
                </>
              ) : (
                <>
                  <Typography fontWeight="bold">
                    vs {match.opponentDeck}
                  </Typography>
                  <Typography>
                    {match.wentFirst ? "先行" : "後攻"} /{" "}
                    {match.result === "win" ? "勝利" : "敗北"} / {match.date}
                    {match.memo && (
                      <Typography variant="caption" color="text.secondary">
                        メモ: {match.memo}
                      </Typography>
                    )}
                  </Typography>
                  <Button
                    onClick={() => handleEdit(match)}
                    size="small"
                    sx={{ fontSize: "0.8rem", mr: 1 }}
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() =>
                      window.confirm("削除しますか？") &&
                      onDeleteMatch(match.id)
                    }
                    color="error"
                    size="small"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    削除
                  </Button>
                </>
              )}
            </Box>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MatchHistory;

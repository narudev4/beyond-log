import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  FormControl,
  Button,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const MatchForm = ({ selectDeckId, onAddMatch, onResetMatches }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [order, setOrder] = useState("");
  const [result, setResult] = useState("");
  const [memo, setMemo] = useState("");
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [error, setError] = useState({
    selectedClass: false,
    order: false,
    result: false,
    deck: false,
  });

  const STORAGE_KEY = "matchResult";

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    calculateWinLose(data);
  }, [selectDeckId]);

  const calculateWinLose = (matchArray) => {
  const filtered = matchArray.filter((m) => m.deckId === selectDeckId);
  const wins = filtered.filter((m) => m.result === "win").length;
  const loses = filtered.filter((m) => m.result === "lose").length;

  if (wins !== winCount) setWinCount(wins);
  if (loses !== loseCount) setLoseCount(loses);
};

  const handleClick = async () => {
    const hasError = {
      selectedClass: selectedClass === "",
      order: order === "",
      result: result === "",
      deck: selectDeckId === null,
    };
    setError(hasError);

    if (Object.values(hasError).some((v) => v)) return;
    const currentUser = auth.currentUser;
    try {
      const docRef = await addDoc(collection(db, "matches"), {
        userId: currentUser?.uid || "guest",
        deckId: selectDeckId,
        opponentDeck: selectedClass,
        wentFirst: order === "先行",
        result: result === "勝利" ? "win" : "lose",
        memo,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date(),
      });

      const matchData = {
        id: docRef.id,
        deckId: selectDeckId,
        opponentDeck: selectedClass,
        wentFirst: order === "先行",
        result: result === "勝利" ? "win" : "lose",
        memo,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date(),
      };

      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [...prev, matchData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (typeof onAddMatch === "function") {
        onAddMatch(matchData);
      }

      setSelectedClass("");
      setOrder("");
      setResult("");
      setMemo("");
      calculateWinLose(updated);
    } catch (error) {
      console.error("Firestoreへの保存に失敗:", error);
    }
  };

  return (
    <Box component="section">
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1, mb: 2 }}
      >
        勝敗登録
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >

        <FormControl sx={{ width: 300, m: 1 }} error={error.selectedClass}>

          <InputLabel id="class-select-label">対戦したクラスを選択</InputLabel>

          <Select
            labelId="class-select-label"
            label="対戦したクラスを選択"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >

            <MenuItem value="エルフ">エルフ</MenuItem>
            <MenuItem value="ロイヤル">ロイヤル</MenuItem>
            <MenuItem value="ウィッチ">ウィッチ</MenuItem>
            <MenuItem value="ドラゴン">ドラゴン</MenuItem>
            <MenuItem value="ナイトメア">ナイトメア</MenuItem>
            <MenuItem value="ビショップ">ビショップ</MenuItem>
            <MenuItem value="ネメシス">ネメシス</MenuItem>
          </Select>
        </FormControl>
        <Box>

          <RadioGroup
            row
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <FormControlLabel
              value="先行"
              control={<Radio />}
              label="先行"
              sx={error.order ? { color: "red" } : {}}
            />
            <FormControlLabel
              value="後攻"
              control={<Radio />}
              label="後攻"
              sx={error.order ? { color: "red" } : {}}
            />
          </RadioGroup>
          <RadioGroup
            row
            value={result}
            onChange={(e) => setResult(e.target.value)}
          >
            <FormControlLabel
              value="勝利"
              control={<Radio />}
              label="勝利"
              sx={error.result ? { color: "red" } : {}}
            />
            <FormControlLabel
              value="敗北"
              control={<Radio />}
              label="敗北"
              sx={error.result ? { color: "red" } : {}}
            />
          </RadioGroup>
        </Box>
        <TextField
          label="メモ"
          variant="outlined"
          sx={{ m: 1 }}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <Stack direction="row" spacing={2} sx={{ m: 1 }}>
          <Button variant="contained" sx={{ p: 1, m: 2 }} onClick={handleClick}>
            結果登録
          </Button>
          <Button
            variant="contained"
            sx={{ p: 1, m: 2 }}
            onClick={() => {
              if (!selectDeckId) {
                alert("デッキを選択してください");
                return;
              }
              const confirmReset =
                window.confirm("このデッキの戦績をリセットしますか？");
              if (confirmReset) {
                onResetMatches(selectDeckId);
              }
            }}
          >
            戦績をリセット
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MatchForm;

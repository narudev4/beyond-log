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
import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { ClassName, Match } from "@/types/domain";

type Order = "先行" | "後攻";
type ResultJa = "勝利" | "敗北";

interface MatchFormProps {
  selectDeckId: string | null;
  onAddMatch: (m: Match) => void;
  onResetMatches: (deckId: string) => void;
}

interface ErrorState {
  selectedClass: boolean;
  order: boolean;
  result: boolean;
  deck: boolean;
}

const STORAGE_KEY = "matchResult";

const MatchForm = ({
  selectDeckId,
  onAddMatch,
  onResetMatches,
}: MatchFormProps) => {
  const [selectedClass, setSelectedClass] = useState<ClassName | "">("");
  const [order, setOrder] = useState<Order | "">("");
  const [result, setResult] = useState<ResultJa | "">("");
  const [memo, setMemo] = useState<string>("");
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [error, setError] = useState<ErrorState>({
    selectedClass: false,
    order: false,
    result: false,
    deck: false,
  });

  const calculateWinLose = useCallback((matchArray: Match[]) => {
    const filtered = matchArray.filter((m) => m.deckId === selectDeckId);
    const wins = filtered.filter((m) => m.result === "win").length;
    const loses = filtered.filter((m) => m.result === "lose").length;
    if (wins !== winCount) setWinCount(wins);
    if (loses !== loseCount) setLoseCount(loses);
  },[selectDeckId, winCount, loseCount]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    calculateWinLose(data);
  }, [calculateWinLose]);

  const handleClassChange = (e: SelectChangeEvent<string>) => {
    setSelectedClass(e.target.value as ClassName);
  };
  const handleOrderChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    setOrder(e.target.value as Order);
  };
  const handleResultChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    setResult(e.target.value as ResultJa);
  };
  const handleClick = async () => {
    const hasError = {
      selectedClass: selectedClass === "",
      order: order === "",
      result: result === "",
      deck: selectDeckId === null,
    };
    setError(hasError);
    if (Object.values(hasError).some(Boolean)) return;

    const currentUser = auth.currentUser;
    try {
      const payload = {
        userId: currentUser?.uid || "guest",
        deckId: selectDeckId!,
        opponentDeck: selectedClass as ClassName,
        wentFirst: order === "先行",
        result: result === "勝利" ? "win" : ("lose" as Match["result"]),
        memo,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "matches"), payload);

      const matchData: Match = {
        id: docRef.id,
        deckId: payload.deckId,
        opponentDeck: payload.opponentDeck,
        wentFirst: payload.wentFirst,
        result: payload.result,
        memo: payload.memo,
        date: payload.date,
        createdAt: payload.createdAt as Date,
      };

      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [...prev, matchData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      onAddMatch(matchData);

      setSelectedClass("");
      setOrder("");
      setResult("");
      setMemo("");
      calculateWinLose(updated);
    } catch (error) {
      console.error("Firestoreへの保存に失敗:", error);
      alert("保存に失敗しました");
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
            onChange={handleClassChange}
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
          <RadioGroup row value={order} onChange={handleOrderChange}>
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
          <RadioGroup row value={result} onChange={handleResultChange}>
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

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
} from "@mui/material";
import React, { useState,useEffect } from "react";

const MatchForm = () => {
  // state
  const [selectedClass, setSelectedClass] = useState(""); // 対戦クラス
  const [order, setOrder] = useState(""); // 先行・後攻
  const [result, setResult] = useState(""); // 勝利・敗北
  const [memo, setMemo] = useState(""); // メモ
	const [winCount, setWinCount] = useState(0);
	const [loseCount, setLoseCount] = useState(0);
  const [error, setError] = useState({
    // エラーメッセージ用の状態
    selectedClass: false,
    order: false,
    result: false,
  });

	// ローカルストレージキーを決める
	const STORAGE_KEY = "matchResult";

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		calculateWinLose(data);
	}, []);

  // 関数
	const calculateWinLose = (matchArray) => {
		const wins = matchArray.filter((m) => m.result === "勝利").length;
		const loses = matchArray.filter((m) => m.result === "敗北").length;
		setWinCount(wins);
		setLoseCount(loses);
	}

  const handleClick = () => {
    const hasError = {
      selectedClass: selectedClass === "",
      order: order === "",
      result: result === "",
    };
    setError(hasError);

    if (Object.values(hasError).some((v) => v)) return; // どれか１つでもtrueなら処理中断

    const matchData = {
			id: Date.now(),
      selectedClass,
      order,
      result,
      memo,
    };

		const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		const updated = [...prev, matchData];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

		// 入力値をリセット
    setSelectedClass("");
    setOrder("");
    setResult("");
    setMemo("");

		calculateWinLose(updated);
  };
  return (
    <Box component="section">
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 2, mb: 2 }}
      >
        勝敗登録
      </Typography>
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
      <Button variant="contained" sx={{ p: 1, m: 2 }} onClick={handleClick}>
        結果登録
      </Button>
			<Box sx={{ m:2 }}>
				<Typography>勝利数：{winCount}</Typography>
				<Typography>敗北数：{loseCount}</Typography>
			</Box>
    </Box>
  );
};

export default MatchForm;

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
  // state
  const [selectedClass, setSelectedClass] = useState(""); // 対戦クラス
  const [order, setOrder] = useState(""); // 先行・後攻
  const [result, setResult] = useState(""); // 勝利・敗北
  const [memo, setMemo] = useState(""); // メモ
  const [winCount, setWinCount] = useState(0); // 勝利数 WinRateGraphで表示予定
  const [loseCount, setLoseCount] = useState(0); // 敗北数 WinRateGraphで表示予定
  const [error, setError] = useState({
    // エラーメッセージ用の状態
    selectedClass: false, // 初期値は未選択(false = エラーなし)
    order: false,
    result: false,
    deck: false,
  });

  // ローカルストレージの保存キー
  const STORAGE_KEY = "matchResult";

  // デッキ選択時：ローカルストレージから対戦結果を取得し、勝敗数を集計
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    calculateWinLose(data);
  }, [selectDeckId]);

  // ローカルストレージに保存された対戦結果の中から勝利数・敗北数を取り出して更新する関数
  const calculateWinLose = (matchArray) => {
  const filtered = matchArray.filter((m) => m.deckId === selectDeckId);
  const wins = filtered.filter((m) => m.result === "win").length;
  const loses = filtered.filter((m) => m.result === "lose").length;

  if (wins !== winCount) setWinCount(wins);
  if (loses !== loseCount) setLoseCount(loses);
};

  // 対戦結果をローカルストレージに保存する関数
  const handleClick = async () => {
    // エラー処理の関数
    const hasError = {
      selectedClass: selectedClass === "", // 空文字だとtrue（＝未選択）、選択されているとfalseになる
      order: order === "",
      result: result === "",
      deck: selectDeckId === null,
    };
    setError(hasError); // エラー情報を更新

    // Object.values(hasError)で[true, true, false]のような配列を取り出す
    //.some((v) => v)は１つでもtrueがあればtrueを返すメソッド
    // 取り出した配列にどれか１つでも未入力があればtrueになるから処理を中断する
    if (Object.values(hasError).some((v) => v)) return;
    const currentUser = auth.currentUser;
    // 戦績データ
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

      // Firebaseが発行したIDをmatchData.idに使う
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

      // localStorageに保存
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [...prev, matchData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (typeof onAddMatch === "function") {
        onAddMatch(matchData);
      }

      // フォームリセットと勝率更新
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
        {/* エラー確認のためにerror={error.selectedClass} */}
        <FormControl sx={{ width: 300, m: 1 }} error={error.selectedClass}>
          {/* id,labelId,labelを設定するとよりラベルが入力欄に重ならずに表示できる */}
          <InputLabel id="class-select-label">対戦したクラスを選択</InputLabel>
          {/* クラスが変わったときselectedClassを更新 */}
          <Select
            labelId="class-select-label"
            label="対戦したクラスを選択"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {/* MenuItemはHTMLの<option>のようなもの */}
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
          {/* rowで横並び
				先行・後攻の状態
				選択時setOrderを更新 */}
          <RadioGroup
            row
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            {/* control={<Radio />}を指定するとラジオボタンになる
					sx={}はerror.orderがtrue（＝未選択）なら文字を赤くする */}
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
        {/* 値が変わったときsetMemoを更新 */}
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
      {/* <Box sx={{ m: 2 }}>
        <Typography>勝利数：{winCount}</Typography>
        <Typography>敗北数：{loseCount}</Typography>
      </Box> */}
    </Box>
  );
};

export default MatchForm;

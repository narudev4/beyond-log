"use client";
import { Grid } from "@mui/material";
import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";
import { useEffect, useState } from "react";

// ローカルストレージに保存する際のキー（MatchFormと統一）
const STORAGE_KEY = "matchResult";

export default function DashboardPage() {
	const [matches, setMatches] = useState([]); // MatchFormから追加される対戦履歴一覧
	const [selectDeckId, setSelectDeckId ] = useState(null); // DeckPanelからリフトアップ

  // 初回マウント時にローカルストレージから保存済みの戦績を読み込む
	useEffect(() => {
		const savedMatches = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") // ローカルからmatchResultか空配列を取得
		setMatches(savedMatches); // 再レンダリング時にもグラフが復元される
	},[]);

  return (
		<Grid container spacing={0.5}>
			{/* DeckPanelとMatchFormにpropsとしてselectDeckIdを渡す */}
			<Grid size={4}><DeckPanel selectDeckId={selectDeckId} onSelectDeck={setSelectDeckId} /></Grid>

			{/* MatchFormの登録内容を元に勝率グラフを更新 */}
			<Grid size={4}><WinRateGraph matches={matches}/></Grid>

			{/* 新しい戦績が追加されたらsetMatchesで追加する */}
			<Grid size={4}><MatchForm selectDeckId={selectDeckId} onAddMatch={(prev) => setMatches([...prev, newMatch])} /></Grid>
		</Grid>
  );
}
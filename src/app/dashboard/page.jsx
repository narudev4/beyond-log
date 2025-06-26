"use client";
import { Grid } from "@mui/material";
import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";
import { useState } from "react";

const dummy = [
	{ id: "1", result: "win", wentFirst: true },
	{ id: "2", result: "lose", wentFirst: false },
	{ id: "3", result: "win", wentFirst: true },
	{ id: "4", result: "win", wentFirst: false },
]


export default function DashboardPage() {
	const [selectDeckId, setSelectDeckId ] = useState(null); // DeckPanelからリフトアップ
  return (
		<Grid container spacing={0.5}>
			{/* DeckPanelとMatchFormにpropsとしてselectDeckIdを渡す */}
			<Grid size={4}><DeckPanel selectDeckId={selectDeckId} onSelectDeck={setSelectDeckId}/></Grid> 
			<Grid size={4}><WinRateGraph matches={dummy}/></Grid>
			<Grid size={4}><MatchForm selectDeckId={selectDeckId} /></Grid>
		</Grid>
  );
}
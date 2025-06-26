"use client";
import { Grid } from "@mui/material";
import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";
import { useState } from "react";


export default function DashboardPage() {
	const [selectDeckId, setSelectDeckId ] = useState(null); // DeckPanelからリフトアップ
  return (
		<Grid container spacing={0.5}>
			{/* DeckPanelとMatchFormにpropsとしてselectDeckIdを渡す */}
			<Grid size={4}><DeckPanel selectDeckId={selectDeckId} onSelectDeck={setSelectDeckId}/></Grid> 
			<Grid size={4}><WinRateGraph /></Grid>
			<Grid size={4}><MatchForm selectDeckId={selectDeckId} /></Grid>
		</Grid>
  );
}
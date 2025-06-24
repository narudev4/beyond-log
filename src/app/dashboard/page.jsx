"use client";
import { Grid } from "@mui/material";
import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";

export default function DashboardPage() {
  return (
		<Grid container spacing={0.5}>
			<Grid size={4}><DeckPanel /></Grid>
			<Grid size={4}><WinRateGraph /></Grid>
			<Grid size={4}><MatchForm /></Grid>
		</Grid>
  );
}
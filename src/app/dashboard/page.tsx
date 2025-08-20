"use client";

import { Box, Grid, Typography } from "@mui/material";

import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";
import MatchHistory from "../components/MatchHistory";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import type { ClassName, Match } from "@/types/domain";

const STORAGE_KEY = "matchResult";

type MatchDoc = Omit<Match, "id" | "createdAt"> & {
  userId: string;
  createdAt?: Timestamp | Date;
};
type UpdateFromHistory = {
  id: string;
  opponentDeck?: ClassName | null;
  wentFirst?: boolean;
  result?: Match["result"];
  memo?: string;
  date?: string;
};

const toMatch = (docId: string, d: MatchDoc): Match => ({
  id: docId,
  deckId: d.deckId,
  opponentDeck: d.opponentDeck,
  wentFirst: d.wentFirst,
  result: d.result,
  memo: d.memo,
  date: d.date,
  createdAt: d.createdAt instanceof Date ? d.createdAt : undefined,
});

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [selectDeckId, setSelectDeckId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const localMatches = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        ) as Match[];
        if (
          localMatches.length > 0 &&
          !localStorage.getItem("migratedToFirestore")
        ) {
          for (const match of localMatches) {
            try {
              const { id: _drop, ...rest } = match;
              await addDoc(collection(db, "matches"), {
                ...rest,
                userId: user.uid,
                createdAt: new Date(),
              });
            } catch (err) {
              console.error("Firestoreへの移行に失敗", err);
            }
          }
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem("migratedToFirestore", "true");
        }
        try {
          const q = query(
            collection(db, "matches"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetchedMatches = querySnapshot.docs.map((doc) =>
            toMatch(doc.id, doc.data() as MatchDoc)
          );
          const unique = Array.from(
            new Map(fetchedMatches.map((m) => [m.id, m])).values()
          );
          setAllMatches(unique);
          setMatches(unique);
        } catch (err) {
          console.error("Firestoreからの取得に失敗", err);
        }
      } else {
        const saved = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        ) as Match[];
        setAllMatches(saved);
        setMatches(saved);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeckChange = (deckId: string | null) => {
    const filtered = allMatches.filter((m) => m.deckId === deckId);
    setMatches(filtered);
  };
  const handleResetMatches = (deckId: string) => {
    const filtered = allMatches.filter((m) => m.deckId !== deckId);
    const updated = JSON.stringify(filtered);
    localStorage.setItem(STORAGE_KEY, updated);
    setAllMatches(filtered);
    setMatches([]);
  };
  const handleDeleteMatches = (id: string) => {
    const newMatches = matches.filter((m) => m.id !== id);
    setMatches(newMatches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMatches));
    setAllMatches(newMatches);
  };

  const handleUpdateMatch = (update: UpdateFromHistory) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== update.id) return m;
        const { opponentDeck, ...rest } = update;
        return {
          ...m,
          ...(opponentDeck == null ? {} : { opponentDeck }), // null/undefined は無視
          ...rest,
        } as Match;
      })
    );

    setAllMatches((prev) =>
      prev.map((m) => {
        if (m.id !== update.id) return m;
        const { opponentDeck, ...rest } = update;
        return {
          ...m,
          ...(opponentDeck == null ? {} : { opponentDeck }),
          ...rest,
        } as Match;
      })
    );
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 104px)",
      }}
    >
      <Grid
        container
        columns={12}
        sx={{ width: "100%", marginTop: { xs: "56px", sm: "64px" } }}
        spacing={0.5}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ height: "100%" }}>
            <DeckPanel
              selectDeckId={selectDeckId}
              onSelectDeck={setSelectDeckId}
              onDeckChange={handleDeckChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ height: "100%" }}>
            <MatchForm
              selectDeckId={selectDeckId}
              onAddMatch={(newMatch) => {
                setMatches((prev) => [...prev, newMatch]);
                setAllMatches((prev) => [...prev, newMatch]);
              }}
              onResetMatches={handleResetMatches}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Box sx={{ height: 420, overflowY: "auto" }}>
            <MatchHistory
              matches={matches}
              selectDeckId={selectDeckId}
              onDeleteMatch={handleDeleteMatches}
              onUpdateMatch={handleUpdateMatch}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {selectDeckId ? (
            <WinRateGraph matches={matches} selectDeckId={selectDeckId} />
          ) : (
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ bgcolor: "grey.300", p: 2 }}
              >
                グラフ
              </Typography>
              <Typography sx={{ p: 2 }}>
                デッキを選択すると戦績が表示されます
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

"use client";
import { Box, Grid, Typography } from "@mui/material";
import DeckPanel from "../components/DeckPanel";
import WinRateGraph from "../components/WinRateGraph";
import MatchForm from "../components/MatchForm";
import { useEffect, useState } from "react";
import MatchHistory from "../components/MatchHistory";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";

// ローカルストレージに保存する際のキー（MatchFormと統一）
const STORAGE_KEY = "matchResult";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const localMatches = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );
        if (
          localMatches.length > 0 &&
          !localStorage.getItem("migratedToFirestore")
        ) {
          for (const match of localMatches) {
            try {
              const { id, ...rest } = match;
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
          const fetchedMatches = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const uniqueMatches = Array.from(
            new Map(fetchedMatches.map((m) => [m.id, m])).values()
          );

          setAllMatches(fetchedMatches);
          setMatches(fetchedMatches);
        } catch (err) {
          console.error("Firestoreからの取得に失敗", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      const savedMatches = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      setMatches(savedMatches);
      setAllMatches(savedMatches);
    }
  }, [user]);

  const [matches, setMatches] = useState([]); // MatchFormから追加される対戦履歴一覧（全体の戦績）
  const [allMatches, setAllMatches] = useState([]);
  const [selectDeckId, setSelectDeckId] = useState(null); // 現在選択中のデッキid（DeckPanelからリフトアップ)

  // // 初回マウント時にローカルストレージから保存済みの戦績を読み込む
  // useEffect(() => {
  //   const savedMatches = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); // ローカルからmatchResultか空配列を取得
  //   setMatches(savedMatches); // 再レンダリング時にもグラフが復元される
  //   setAllMatches(savedMatches);
  // }, []);

  // ローカルストレージから全体の戦績を取得してdeckIdを照らし合わせてsetMatchesで更新する
  // propsとしてDeckPanelに関数をわたす
  const handleDeckChange = (deckId) => {
    const filtered = allMatches.filter((m) => m.deckId === deckId);
    setMatches(filtered);
  };
  const handleResetMatches = (deckId) => {
    const filtered = allMatches.filter((m) => m.deckId !== deckId);
    const updated = JSON.stringify(filtered);
    localStorage.setItem(STORAGE_KEY, updated);
    setAllMatches(filtered);
    setMatches([]);
  };
  const handleDeleteMatches = (id) => {
    const newMatches = matches.filter((m) => m.id !== id);
    setMatches(newMatches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMatches));
    setAllMatches(newMatches);
  };

  const handleUpdateMatch = (updatedMatch) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === updatedMatch.id ? { ...m, ...updatedMatch } : m
      )
    );
    setAllMatches((prev) =>
      prev.map((m) =>
        m.id === updatedMatch.id ? { ...m, ...updatedMatch } : m
      )
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
        {/* デッキの選択・作成・削除するフォーム */}
        {/* DeckPanelとMatchFormにpropsとしてselectDeckIdを渡す */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
  <Box sx={{ height: "100%" }}>
    <DeckPanel
      selectDeckId={selectDeckId}
      onSelectDeck={setSelectDeckId}
      onDeckChange={handleDeckChange}
    />
  </Box>
</Grid>

        {/* 戦績（matches）を新規登録するフォーム*/}
        {/* selectDeckIdで選択中のデッキの戦績に限定できる */}
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

        <Grid size={{ xs: 12, sm: 12, md: 4 }} >
          <Box sx={{ height: 420, overflowY: "auto" }}>
    <MatchHistory
      matches={matches}
      selectDeckId={selectDeckId}
      onDeleteMatch={handleDeleteMatches}
      onUpdateMatch={handleUpdateMatch}
    />
  </Box>
        </Grid>
        {/* グラフを表示するフォーム*/}
        {/* MatchFormの登録内容(matches)を元に勝率グラフを更新 */}
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {selectDeckId ? (
            <WinRateGraph matches={matches} selectDeckId={selectDeckId} />
          ) : (
            <Box>
              {/* １つ目のTypographyはコンポーネント化するかもしれない */}
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

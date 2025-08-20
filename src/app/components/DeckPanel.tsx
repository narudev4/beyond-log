import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { saveDeckToFirestore } from "../lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { fetchUserDecks } from "../lib/firebaseUtils";
import { Deck,ClassName } from "@/types/domain";
import type { SelectChangeEvent } from "@mui/material/Select";

interface DeckPanelProps {
	selectDeckId: string | null;
	onSelectDeck: (id: string | null) => void;
	onDeckChange: (id: string | null) => void;
}

const DeckPanel = ({ selectDeckId, onSelectDeck, onDeckChange }: DeckPanelProps) => {
  const [deckList, setDeckList] = useState<Deck[]>([]);
  const [deckName, setDeckName] = useState<string>("");
  const [deckClass, setDeckClass] = useState<Deck["class"] | "">("");

  useEffect(() => {
  const saved = localStorage.getItem("deckList");
  if (saved) {
    try { setDeckList(JSON.parse(saved) as Deck[]); } catch {}
  }
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const decks = await fetchUserDecks(user.uid);
        setDeckList(decks);
      } else {
        const savedDecks = localStorage.getItem("deckList");
        if (savedDecks) {
          setDeckList(JSON.parse(savedDecks));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("deckList", JSON.stringify(deckList));
  }, [deckList]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deckName) {
      alert("デッキ名を入力してください");
      return;
    }
    if (!deckClass) {
      alert("クラスを選択してください");
      return;
    }
    const newDeck = {
      id: Date.now().toString(),
      name: deckName,
      class: deckClass,
    };
    setDeckList([...deckList, newDeck]);
    onSelectDeck(newDeck.id);
    await saveDeckToFirestore(newDeck);
  };

	const handleDeckSelect = (e: SelectChangeEvent<string>) => {
    const id = e.target.value;
    const deck = deckList.find((d) => d.id === id);
    if (deck) {
      onSelectDeck(deck.id);
      onDeckChange(deck.id);
      setDeckName(deck.name);
      setDeckClass(deck.class);
    }
  };

  const handleUpdate = () => {
    if (!selectDeckId) {
      alert("編集するデッキを選択してください");
      return;
    }
    const updatedDeckList = deckList.map(
      (d) =>
        d.id === selectDeckId
          ? {
              ...d,
              name: deckName,
              class: deckClass as ClassName,
            }
          : d
    );
    setDeckList(updatedDeckList);
  };

  const handleDelete = (id: string | null) => {
    const confirmDelete = window.confirm("このデッキを削除しますか？");
    if (confirmDelete) {
      setDeckList((prev) => prev.filter((d) => d.id !== id));
      setDeckClass("");
      setDeckName("");
      onSelectDeck(null);
      onDeckChange(null);
    }
  };

  return (
    <Box component="section">
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1, mb: 2 }}
      >
        デッキ
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
					justifyContent: "center",
          px: 2,
					width: "100%",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 320 }}>
          <FormControl sx={{ width: 300, m: 1 }}>
            <InputLabel id="deck-select-label">デッキを選択</InputLabel>
            <Select
              value={selectDeckId ?? ""}
              onChange={handleDeckSelect}
              labelId="deck-select-label"
              label="デッキを選択"
            >
              {deckList.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                  {" - "}
                  {d.class}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 300, m: 1 }}>
            <InputLabel id="class-select-label">クラスを選択</InputLabel>
            <Select
              labelId="class-select-label"
              label="クラスを選択"
              name="selectClass"
              value={deckClass}
              onChange={(e) => setDeckClass(e.target.value)}
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

          <TextField
            label="デッキ名を入力"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            sx={{ m: 1 }}
          />
          <Stack direction="row" spacing={2} sx={{ m: 1 }}>
            <Button variant="contained" type="submit" sx={{ whiteSpace: "nowrap", minWidth: 100 }}>
              新規登録
            </Button>
            <Button
              variant="outlined"
              type="button"
              onClick={handleUpdate}
              disabled={!selectDeckId}
							sx={{ whiteSpace: "nowrap", minWidth: 100 }}
            >
              上書き保存
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              type="button"
              onClick={() => handleDelete(selectDeckId)}
              disabled={!selectDeckId}
							sx={{ whiteSpace: "nowrap", minWidth: 100 }}
            >
              削除
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default DeckPanel;

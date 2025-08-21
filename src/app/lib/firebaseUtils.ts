import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
	type DocumentData,
	type UpdateData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Deck, Result, ClassName } from "@/types/domain"

export const fetchUserDecks = async (userId: string): Promise<Deck[]> => {
  try {
    const q = query(collection(db, "decks"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Deck, "id">),
    }));
  } catch (error) {
    console.error("デッキ取得に失敗しました:", error);
    return [];
  }
};

type MatchUpdate = {
	opponentDeck?: ClassName | null;
  wentFirst?: boolean;
  result?: Result;
  memo?: string;
}

export const updateMatchInFirestore = async(
	matchId: string, newData: MatchUpdate
): Promise<void> => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, newData as UpdateData<DocumentData>);
};

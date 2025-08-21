import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

interface Deck {
	id: string;
	name: string;
	class: string;
	imageUrl: string;
	userId: string;
	createdAt: Date;
}

export const fetchUserDecks = async (userId: string): Promise<Deck[]> => {
  try {
    const q = query(collection(db, "decks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Deck, "id">),
    }));
  } catch (error) {
    console.error("デッキ取得に失敗しました:", error);
    return [];
  }
};

export const updateMatchInFirestore = async(
	matchId: string, newData: Record<string, unknown>
): Promise<void> => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, newData);
};

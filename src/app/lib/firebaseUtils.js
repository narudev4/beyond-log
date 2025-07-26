import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const fetchUserDecks = async (userId) => {
  try {
    const q = query(collection(db, "decks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const decks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return decks;
  } catch (error) {
    console.error("デッキ取得に失敗しました:", error);
    return [];
  }
};

export const updateMatchInFirestore = async (matchId, newData) => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, newData);
};

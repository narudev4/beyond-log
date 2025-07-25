// lib/firebaseUtils.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Firestore からログインユーザーのデッキ一覧を取得する
 * @param {string} userId - Firebase AuthのユーザーID
 * @returns {Promise<Array>} ユーザーのデッキ一覧（オブジェクト配列）
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
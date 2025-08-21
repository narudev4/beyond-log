import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getFirestore, collection, addDoc } from "firebase/firestore";
import type { NextRouter } from "next/router";

const db = getFirestore();

export const loginWithGoogle = async (router: NextRouter): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "no name",
        email: user.email || "",
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      },
      { merge: true }
    );
    if (result.user) {
      router.push("/dashboard");
    }
  } catch (err) {
    console.error("ログインエラー", err);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("ログアウトエラー", err);
  }
};

interface DeckData {
	name: string;
	class: string;
	imageUrl?: string;
}

export const saveDeckToFirestore = async (deckData: DeckData): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    await addDoc(collection(db, "decks"), {
      userId: currentUser.uid,
      name: deckData.name,
      class: deckData.class,
      imageUrl: deckData.imageUrl || "",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("デッキの保存に失敗しました", error);
  }
};
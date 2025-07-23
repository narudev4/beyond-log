import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithGoogle = async (router) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      router.push("/dashboard");
    }
  } catch (err) {
    console.error("ログインエラー", err);
  }
};

export const logout = async () => {
	try {
		await signOut(auth);
	} catch (err){
		console.error("ログアウトエラー", err);
	}
};
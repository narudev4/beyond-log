import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		await signInWithPopup(auth, provider);
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
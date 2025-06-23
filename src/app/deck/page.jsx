"use client"; // useStateを使うからuse clientを記載
import React, { useState,useEffect } from "react";
import DeckList from "./components/DeckList";

const DeckForm = () => {
  const [deckName, setDeckName] = useState(""); // デッキ名
  const [imageUrl, setImageUrl] = useState(""); // 画像をurlとして管理
	const [decks, setDecks] = useState([]);

	useEffect(() => {
    const storedDecks = JSON.parse(localStorage.getItem("decks") || "[]"); // 初回マウント時デッキ一覧を取得しsetDecksを更新
    setDecks(storedDecks);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // e.target.filesでfilesオブジェクトを取得
    if (!file) return; // ファイル選択を途中でやめた場合などに処理を中断する
		const reader = new FileReader(); // FileReader APIを使ってファイルを読み込むためのオブジェクトを作成
		reader.onloadend = () => { // ファイルを onloadend（読み込みが完了）したときに実行される処理
			setImageUrl(reader.result); // reader.resultにはBase64形式の画像データが文字列で入っている
		};
		reader.readAsDataURL(file); // filesオブジェクト（画像ファイル）をBase64形式の文字列に変換して読み込み開始
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // サブミット時のデフォルトの挙動を止める
    if (!deckName) {
      // deckNameがなければアラート
      alert("デッキ名を入力してください");
      return;
    }
    const newDeck = {
      // newDeckとしてオブジェクトにid,name,imageUrlをまとめる
      id: Date.now(),
      name: deckName,
      imageUrl: imageUrl,
    };
    // localStorageから既存のデッキ配列を取得（初回はnullになるから"[]"にする）JSON.parseで文字列を配列に変換
    const existingDecks = JSON.parse(localStorage.getItem("decks") || "[]");
    // existingDecksとnewDeckを配列に追加
    const updatedDecks = [...existingDecks, newDeck];
    // 配列を文字列に変換して"decks"というキーでローカルストレージに保存
    localStorage.setItem("decks", JSON.stringify(updatedDecks));
		setDecks(updatedDecks); // 画像表示のためにstateも更新
    // デッキ登録後フォームをクリア（deckNameとimageUrlをリセット）
    setDeckName("");
    setImageUrl("");
    alert("デッキを登録しました");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Formがsubmitしたときに関数呼び出し */}
        <div>
          <label>デッキ名：</label>
          <input
            type="text"
            value={deckName} // deckNameのstateをinputに反映
            onChange={(e) => setDeckName(e.target.value)} // value={deckName}でinputに反映してるからsetDeckNameで更新できる
            placeholder="デッキ名を入力"
          />
        </div>
        <div>
          <label>デッキ画像をアップロード：</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {/* accept="image/*"で画像形式のみを選択可能に */}
        </div>
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="preview" className="max-w-xs" />
            {/* 画像が表示されなかったときに表示するテキスト（アクセシビリティ対策	） */}
          </div>
        )}
        <button className="bg-cyan-400">登録（保存まだ）</button>
      </form>
      <DeckList decks={decks} /> {/* decks={decks}で親の状態をそのまま表示するだけのコンポーネント */}
    </div>
  );
};

export default DeckForm;

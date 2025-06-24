"use client";
import React, { useEffect, useState } from "react";
import SelfDeckList from "./self-components/SelfDeckList";

const SelfDeckWrite = () => {
  // デッキ名・画像URL・propsで渡すデッキのstate
  const [deckName, setDeckName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
	const [decks, setDecks] = useState("");

	useEffect(() => {
		const storageDecks = JSON.parse(localStorage.getItem("decks" || "[]"));
		setDecks(storageDecks);
	},[]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // filesオブジェクトを変数fileにいれる
    if (!file) return; // 途中でファイル選択をキャンセルした場合の簡易バリデーション
    setImageUrl(URL.createObjectURL(file)); // fileオブジェクトをローカルで使えるURLに変更してimageUrlを更新
		const reader = new FileReader(); // FileReaderでファイルをよみこむ
		reader.onloadend = () => { // 読み込み終了時画像を表示
			setImageUrl(reader.result) // reader.resultで画像データが入っている
		};
		reader.readAsDataURL(file); // reader.readAsDataURLでfileをURLに変換
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // submit時のデフォルトの挙動を制御
    if (!deckName) {
      alert("デッキ名を入力してください");
      return;
    }
    // newDeckをid,name,imageUrlのオブジェクトにする
    const newDeck = {
      id: Date.now(),
      name: deckName,
      imageUrl: imageUrl,
    };
    // ローカルストレージから既存の配列を取得（なければ空配列を取得）
      const existingDecks = JSON.parse(localStorage.getItem("decks") || "[]");
      // 新しいデッキを取得
      const updatedDecks = [...existingDecks, newDeck];
      // ローカルストレージに保存
      localStorage.setItem("decks", JSON.stringify(updatedDecks));
			setDecks(updatedDecks)
      // フォームをクリア
      setDeckName("");
      setImageUrl("");
      alert("デッキを登録しました");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>デッキ名を入力：</p>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </label>
        <label>
          <p>デッキ画像を選択：</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <div>
          {imageUrl && (
            <img src={imageUrl} alt="デッキ画像" className="max-w-xs" />
          )}
        </div>
        <button>登録</button>
      </form>
			<SelfDeckList decks={decks} />
		</div>
  );
};

export default SelfDeckWrite;

import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const DeckPanel = () => {
  const [deckList, setDeckList] = useState([]); // 作成したデッキを配列で状態管理
  const [selectDeckId, setSelectDeckId] = useState(""); // 選択されたデッキのid
  const [deckName, setDeckName] = useState(""); // デッキの名前
  const [deckImageUrl, setDeckImageUrl] = useState(null); // デッキの画像URL
  const [deckClass, setDeckClass] = useState(""); // デッキのクラス（エルフ・ロイヤルなど）

  // 初回マウント時ローカルに保存されたデッキリストがあればdeckListを更新する
  useEffect(() => {
    const savedDecks = localStorage.getItem("deckList");
    if (savedDecks) {
      setDeckList(JSON.parse(savedDecks));
    }
  }, []);

  // deckListの状態が変わるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("deckList", JSON.stringify(deckList));
  }, [deckList]);

  // サブミット時にデッキを新規登録する関数
  const handleSubmit = (e) => {
    e.preventDefault(); // サブミット時のデフォルトの挙動を制御
    if (!deckName) {
      // 簡易バリデーション
      alert("デッキ名を入力してください");
      return;
    }
    if (!deckClass) {
      // 簡易バリデーション
      alert("クラスを選択してください");
      return;
    }
    const newDeck = {
      // id,name,deckImage,classをnewDeckオブジェクトでデッキを保存する
      id: Date.now(),
      name: deckName,
      deckImage: deckImageUrl,
      class: deckClass,
    };
    setDeckList([...deckList, newDeck]); // 既存のdeckListにnewDeckを追加して新しい配列にする
    setSelectDeckId(newDeck.id); // newDeck.idでセレクトされているデッキのidを更新
  };

  // 画像が変わったときに画像を取得しURLに変換する関数
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // e.target.files[0]で画像を取得
    if (!file) return; // 画像がなければリターン
    const reader = new FileReader(); // inputのファイルにアクセス
    reader.onloadend = () => {
      //readerのリロード完了時実行
      setDeckImageUrl(reader.result); // deckImageUrlを更新(reader.result)で画像URL
    };
    reader.readAsDataURL(file); // fileをURLに変換
  };

  // selectで選択されたデッキIDを元にdeckListからデッキを呼び出して状態に反映する関数
  const handleDeckSelect = (e) => {
    const id = Number(e.target.value); // Number指定でidを取得
    const deck = deckList.find((d) => d.id === id); // 引数にdを渡してd.idがconst idと同じならデッキ内容をifで更新
    if (deck) {
      setSelectDeckId(deck.id);
      setDeckName(deck.name);
      setDeckImageUrl(deck.deckImage);
      setDeckClass(deck.class);
    }
  };

  // デッキを編集する関数
  const handleUpdate = () => {
    if (!selectDeckId) {
      // 簡易バリデーション
      alert("編集するデッキを選択してください");
      return;
    }
    const updatedDeckList = deckList.map(
      (d) =>
        d.id === selectDeckId // 選択中のデッキのみ更新する、それ以外はそのまま帰す
          ? {
              ...d, // 元のデッキ情報を展開
              name: deckName, //入力中の情報に上書き
              deckImage: deckImageUrl,
              class: deckClass,
            }
          : d // 他のデッキはそのまま
    );
    setDeckList(updatedDeckList); // deckListを更新（useEffectも動く）
  };

  // デッキ削除の関数
  const handleDelete = (id) => {
    // 引数にidを渡す
    setDeckList((prev) => prev.filter((d) => d.id !== id)); // previous state（直前の状態）のidが一致しないものを残す（一致するものを削除）
    setDeckClass(""); // 初期化
    setDeckName(""); // 初期化
    setDeckImageUrl(null); // 初期化
    setSelectDeckId(""); // 初期化
  };

  return (
    <div>
			<Typography variant="h6" component="h2" sx={{ bgcolor: "grey.300", p: 2 }}>DECK</Typography>
      <form onSubmit={handleSubmit}>
        {/* formがsubmitしたときhandleSubmitを実行 */}
        <select value={selectDeckId || ""} onChange={handleDeckSelect}>
          {/* valueにdeckIdまたは"",ChangeしたときhandleDeckSelectを実行 */}
          <option value="">DECK</option>
          {/* 引数にdを渡してdeckListをmapでループする、keyとvalueにd.idを設定、d.nameでデッキ名表示 */}
          {deckList.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <label>
          {/* deckImageUrlがあれば画像を表示、なければ<p>を表示 */}
          {deckImageUrl ? (
            <img src={deckImageUrl} alt="デッキ画像" />
          ) : (
            <p>デッキ画像を選択：</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />{" "}
          {/* accept="image/*"で画像のみ選択可能、ChangeしたときhandleImageChangeを実行 */}
        </label>
        {/* ChangeしたときdeckClassを更新 */}
        {/* valueにdeckClass */}
        <select
          name="selectClass"
          value={deckClass}
          onChange={(e) => setDeckClass(e.target.value)}
        >
          <option value="">--クラスを選択--</option>
          <option value="エルフ">エルフ</option>
          <option value="ロイヤル">ロイヤル</option>
          <option value="ウィッチ">ウィッチ</option>
          <option value="ドラゴン">ドラゴン</option>
          <option value="ナイトメア">ナイトメア</option>
          <option value="ビショップ">ビショップ</option>
          <option value="ネメシス">ネメシス</option>
        </select>
        {/* valueにdeckName ChangeしたときdeckNameを更新*/}
        <input
          type="text"
          placeholder="デッキ名を入力"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" type="submit">
            新規登録
          </Button>
          {/* submitしない場合はtype="button"にする clickしたときhandleUpdateを実行 */}
          <Button variant="outlined" type="button" onClick={handleUpdate} disabled={!selectDeckId}>
            上書き保存
          </Button>
          {/* clickしたとき選択中のdeckIdのデッキに対してhandleDeleteを実行 deckIdがないと消せない 簡易バリデーション */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            type="button"
            onClick={() => handleDelete(selectDeckId)}
            disabled={!selectDeckId}
          >
            削除
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default DeckPanel;

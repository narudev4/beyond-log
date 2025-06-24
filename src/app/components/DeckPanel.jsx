import React, { useEffect, useState } from "react";

const DeckPanel = () => {
  const [deckList, setDeckList] = useState([]);
  const [selectDeckId, setSelectDeckId] = useState("");
  const [deckName, setDeckName] = useState("");
  const [deckImageUrl, setDeckImageUrl] = useState(null);
  const [deckClass, setDeckClass] = useState("");

  useEffect(() => {
    const savedDecks = localStorage.getItem("deckList");
    if (savedDecks) {
      setDeckList(JSON.parse(savedDecks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("deckList", JSON.stringify(deckList));
  }, [deckList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deckName) {
      alert("デッキ名を入力してください");
      return;
    }
    if (!deckClass) {
      alert("クラスを選択してください");
      return;
    }
    const newDeck = {
      id: Date.now(),
      name: deckName,
      deckImage: deckImageUrl,
      class: deckClass,
    };
    setDeckList([...deckList, newDeck]);
    setSelectDeckId(newDeck.id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDeckImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeckSelect = (e) => {
    const id = Number(e.target.value);
    const deck = deckList.find((d) => d.id === id);
    if (deck) {
      setSelectDeckId(deck.id);
      setDeckName(deck.name);
      setDeckImageUrl(deck.deckImage);
      setDeckClass(deck.class);
    }
  };

  const handleUpdate = () => {
  if (!selectDeckId) {
    alert("編集するデッキを選択してください");
    return;
  }
  const updatedDeckList = deckList.map((deck) =>
    deck.id === selectDeckId
      ? {
          ...deck,
          name: deckName,
          deckImage: deckImageUrl,
          class: deckClass,
        }
      : deck
  );
  setDeckList(updatedDeckList);
};

  const handleDelete = (id) => {
    setDeckList((prev) => prev.filter((deck) => deck.id !== id));
    setDeckClass("");
    setDeckName("");
    setDeckImageUrl(null);
    setSelectDeckId("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={selectDeckId || ""} onChange={handleDeckSelect}>
          <option value="">デッキを選択</option>
          {deckList.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
        <label>
          {deckImageUrl ? (
            <img src={deckImageUrl} alt="デッキ画像" />
          ) : (
            <p>デッキ画像を選択：</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {/* {deckImageUrl && <img src={deckImageUrl} alt="デッキ画像" />} */}
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

        <input
          type="text"
          placeholder="デッキ名を入力"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />

        <button type="submit">新規登録</button>
        <button type="button" onClick={handleUpdate}>上書き保存</button>
        <button
          type="button"
          onClick={() => handleDelete(selectDeckId)}
          disabled={!selectDeckId}
        >
          削除
        </button>
      </form>
    </div>
  );
};

export default DeckPanel;

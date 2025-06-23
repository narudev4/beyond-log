import React from "react";

const SelfDeckList = ({ decks }) => { // 親コンポーネントからdecksをpropsとして受け取る
  return (
    <div className="p-4">
      <h2>デッキ一覧</h2>
      {decks.length === 0 ? ( // 三項演算子でデッキがなければpを表示、あればulを表示
        <p>デッキはまだありません</p>
      ) : (
        <ul className="grid gap-4 grid-cols-3">
					{ decks.map((deck) => ( // deckを引数として受け取り、decksをmapでループし追加
          <li key={deck.id} className="border p-2 rounded"> {/* liにはkey（deck.id）を渡す */}
						<h3>{deck.name}</h3> {/* deck.nameでデッキ名を表示 */}
						{/* {deck.imageUrl && (
							<img src={deck.imageUrl} alt="デッキ画像" />
						)} */}
					</li>
					))}
        </ul>
      )}
    </div>
  );
};

export default SelfDeckList;

import React from "react";

const DeckList = ({ decks }) => { // decksをpropsとして親から受け取る
  return (
    <div>
			<div className="flex ">
      <h2>保存されたデッキ一覧</h2>
			{/* <button>勝敗登録</button>
			<button>デッキを編集</button> */}
			<button>選択したデッキを削除</button>
			</div>
      {decks.length === 0 ? ( // decksが０個なら<p></p>を表示
        <p>まだデッキが登録されていません</p>
      ) : (
        <ul className="grid gap-4 grid-cols-2"> {/* decksがあればulを表示 */}
          {decks.map((deck) => ( // deckを引数として渡しdecksをmapでループして追加する
            <li key={deck.id} className="border p-4 rounded"> {/* keyにdeck.idを指定 */}
              <h3 className="font-bold">{deck.name}</h3> {/* deck.nameでデッキ名を表示 */}
              {deck.imageUrl && ( // deck.imageUrlがあればデッキ画像表示
								<img src={deck.imageUrl} alt={deck.name} className="max-w-xs mt-2" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeckList;

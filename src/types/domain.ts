export type ClassName =
  | "エルフ"
  | "ロイヤル"
  | "ウィッチ"
  | "ドラゴン"
  | "ナイトメア"
  | "ビショップ"
  | "ネメシス";

export type Result = "win" | "lose";

export interface Deck {
  id: string;
  name: string;
  class: ClassName;
}

export interface Match {
  id: string;
  deckId: string;
  opponentDeck: ClassName;
  wentFirst: boolean;
  result: Result;
  memo?: string;
  date: string;
	createdAt?: Date;
}
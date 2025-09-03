# beyond log
対戦型オンラインデジタルカードゲーム「Shadowverse: Worlds Beyond」を対象とした勝率記録アプリです。
自分と相手のデッキ、先攻・後攻、勝敗、メモなどを記録し、勝率やデッキ相性をグラフで確認できます。
シンプルなUIで、対戦の傾向分析に役立ちます。

## 主な機能
- デッキ作成（デッキ名・クラスを入力して登録）
- 対戦記録 (勝敗・先行/後攻・相手デッキ・メモを記録)
- 勝率グラフ表示（先攻/後攻勝率・相手デッキ別の勝率を円グラフとリストで可視化）
- Firebaseを用いたGoogleログインによるユーザー認証

## スクリーンショット
![PCスクリーンショット](https://github.com/Nalu420/SVWB_WinRate/blob/main/public/PCscreenshot.png?raw=true)
![スマホ(デッキ作成画面)](https://github.com/Nalu420/SVWB_WinRate/blob/main/public/DeckPanel.png?raw=true)
![スマホ(対戦入力フォーム)](https://github.com/Nalu420/SVWB_WinRate/blob/main/public/MatchForm.png?raw=true)
![スマホ(対戦履歴)](https://github.com/Nalu420/SVWB_WinRate/blob/main/public/MatchHistory.png?raw=true)
![スマホ(グラフ)](https://github.com/Nalu420/SVWB_WinRate/blob/main/public/WinRateGraph.png?raw=true)

## 使用技術
- JavaScript
- Next.js
- React
- MUI
- Firebase（Authentication, Firestore）
- Recharts

## 今後の展望
- Twitterログイン・Twitter戦績共有
- React Nativeによるスマホアプリ化（モバイルでの利便性強化）

# リンク
https://beyond-log.vercel.app/
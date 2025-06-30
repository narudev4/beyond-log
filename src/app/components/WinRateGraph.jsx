import { Box, Typography } from "@mui/material";
import React from "react";
// recharts：グラフ描画専用のライブラリ
import {
  BarChart, // 棒グラフ全体のコンテナ
  Bar, // 各データの棒を描画
  ResponsiveContainer, // 親サイズに応じてグラフサイズを自動調整
  Tooltip, // ホバー時にデータを表示
  XAxis, // 横軸（名前）
  YAxis, // Y軸（％表示用）
} from "recharts";

 // matches：対戦データの配列（propsで親から受け取る）
 // トータル・先行・後攻の３つの勝率を計算
const calculateWinRates = (matches) => {
  const total = matches.length; // 全体の試合数
  const totalWins = matches.filter((m) => m.result === "win").length; // 全体の勝率

  const first = matches.filter((m) => m.wentFirst); // 先行の試合数
  const second = matches.filter((m) => !m.wentFirst); // 後攻の試合数

  const firstWins = first.filter((m) => m.result === "win").length; // 先行の勝利数
  const secondWins = second.filter((m) => m.result === "win").length; // 後行の勝利数

	// 勝率の計算（勝利数 ÷ 総試合数 × 100%）
	// 試合数が０の場合0％と表示
	// rechartsに渡すために name + 勝率 の形式で配列を返す
  return [
    {
      name: "全体",
      winRate: total === 0 ? 0 : Math.round((totalWins / total) * 100),
    },
    {
      name: "先行",
      winRate:
        first.length === 0 ? 0 : Math.round((firstWins / first.length) * 100),
    },
    {
      name: "後攻",
      winRate: second.length === 0 ? 0 : Math.round((secondWins / second.length) * 100),
    },
  ];
};

// WinRateGraph：親から対戦データを受け取り、棒グラフとして勝率を表示
const WinRateGraph = ({ matches }) => {
  const data = calculateWinRates(matches);
  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 2 }}
      >
        グラフ
      </Typography>
      <Box sx={{ width: "100%", height: 300}}>
				{/* ResponsiveContainer：親要素に高さを必ず含める */}
        <ResponsiveContainer>
					{/* BarChart：dataを渡すとグラフが描画される */}
          <BarChart data={data}>
						{/* 横軸に全体・先行・後攻の名前を表示 */}
            <XAxis dataKey="name"/>
						{/* 縦軸に勝率を％で表示 */}
            <YAxis unit="%"/>
            <Tooltip />
						{/* dataKeyで表示する項目を指定("勝率")・fillで棒の色を設定 */}
						<Bar dataKey="winRate" fill="#8884d8"/>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WinRateGraph;

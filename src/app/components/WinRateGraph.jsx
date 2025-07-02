import { Box, Typography, Grid } from "@mui/material";
import React from "react";
// recharts：グラフ描画専用のライブラリ
import {
  BarChart, // 棒グラフを包むコンテナ
  Bar, // 各データの棒を描画
  ResponsiveContainer, // 親サイズに応じてグラフサイズを自動調整
  Tooltip, // ホバー時にデータを表示
  XAxis, // 横軸（名前）
  YAxis, // Y軸（％表示用）
  Pie, // 円グラフを描画
  PieChart, // Pieを包むコンテナ
  Cell, // 個別の色を指定できる
  Legend, // ラベル一覧を自動で表示するコンポーネント
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
      winRate:
        second.length === 0
          ? 0
          : Math.round((secondWins / second.length) * 100),
    },
  ];
};

// 対戦したクラスを取得して円グラフ用のオブジェクトに変換する関数
const getOpponentClassDistribution = (matches) => {
  const countMap = {}; // クラスごとの対戦数を記録する空のオブジェクト
  matches.forEach((match) => {
    const cls = match.opponentDeck; // 対戦したクラスを変数に代入
    countMap[cls] = (countMap[cls] || 0) + 1; // オブジェクト[]で変数の中身をキーとして使う
  });
  // countMapオブジェクト（{ "エルフ": 3, "ロイヤル": 2, ... }）を
  // RechartsのPieChartが受け取れる形式（[{ name: "エルフ", value: 3 }, ...]）に変換
  return Object.entries(countMap) // [["エルフ", 3], ["ロイヤル", 2], ...]
    .map(([name, value]) => ({ name, value })) // Recharts用のオブジェクト形式に変換
		.sort((a,b) => b.value - a.value); // value(対戦数)が大きい順にソートする
};

// 円グラフ用の色の配列
const CLASS_COLORS = {
  エルフ: "#4CAF50",
  ロイヤル: "#E6C200",
  ウィッチ: "#5C6BC0",
  ドラゴン: "#FF8C00",
  ナイトメア: "#A03B4C",
  ビショップ: "#DCD0C0",
  ネメシス: "#00CED1",
};

// WinRateGraph：親から対戦データを受け取り、グラフとして勝率を表示
const WinRateGraph = ({ matches }) => {
  const barData = calculateWinRates(matches);
  const pieData = getOpponentClassDistribution(matches);

  return (
    <Box component="section">
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "grey.300", p: 1 }}
      >
        グラフ
      </Typography>
      <Grid container columns={12} sx={{ pt: 5 }}>
        <Grid size={{ sx: 12, md: 4 }} sx={{ width: "100%", height: 300 }}>
          {/* ResponsiveContainer：親要素に高さを必ず含める */}
          <ResponsiveContainer width="100%" height="100%">
            {/* BarChart：dataを渡すとグラフが描画される */}
            <BarChart data={barData}>
              {/* 横軸に全体・先行・後攻の名前を表示 */}
              <XAxis dataKey="name" />
              {/* 縦軸に勝率を％で表示 */}
              <YAxis unit="%" />
              <Tooltip />
              {/* dataKeyで表示する項目を指定("勝率")・fillで棒の色を設定 */}
              <Bar dataKey="winRate" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid size={{ sx: 12, md: 4 }} sx={{ width: "100%", height: 300 }}>
          <Typography>分布</Typography>
          <ResponsiveContainer width="100%" height="100%">
            {/* 円グラフ全体のコンテナ */}
            <PieChart>
              {/*
							data 円グラフに表示するデータ(nameとvalueを持つオブジェクトの配列)
              dataKey データの数値部分のキー（ここではvalue）
              nameKey データの名前部分のキー (ここではname)
              cx/cy グラフの中心座標(50%で中央)
              outerRadius グラフの大きさ（半径）
              fill デフォルトの色（Cellで上書きされるので実際には使われない）
              label セクションごとにラベル(名前や値)を表示
						 */}
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
								startAngle={90}
								endAngle={-270}
								labelLine={false}
								label={({ percent, x, y, index }) => `${(percent * 100).toFixed(0)}%`}  // ← 小数第0位で%表示
              >
                {/* 各クラスごとにセクションを生成 */}
                {/* Cellで個別の色を設定 */}
                {/* COLORS[index % COLORS.length]で色を順番に割り当て */}
                {getOpponentClassDistribution(matches).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CLASS_COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid
          size={{ sx: 12, md: 4 }}
          sx={{ bgcolor: "grey.200", width: "100%", height: 300 }}
        >
          各クラスごとの勝率を表示予定
        </Grid>
      </Grid>
    </Box>
  );
};

export default WinRateGraph;

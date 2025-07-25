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

const getTotalWinRateData = (matches) => {
  const total = matches.length;
  const win = matches.filter((m) => m.result === "win").length;
  const lose = total - win;
  const rate = total === 0 ? 0 : Math.round((win / total) * 100);

  return {
    win,
    lose,
    rate,
    chartData: [
      { name: "勝利", value: win },
      { name: "敗北", value: lose },
    ],
  };
};

// matches：対戦データの配列（propsで親から受け取る）
// トータル・先行・後攻の３つの勝率を計算
const getFirstSecondRates = (matches) => {
  const first = matches.filter((m) => m.wentFirst);
  const second = matches.filter((m) => !m.wentFirst);

  const firstWin = first.filter((m) => m.result === "win").length;
  const secondWin = second.filter((m) => m.result === "win").length;

  const firstRate =
    first.length === 0 ? 0 : Math.round((firstWin / first.length) * 100);
  const secondRate =
    second.length === 0 ? 0 : Math.round((secondWin / second.length) * 100);

  return { firstRate, secondRate };
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
    .sort((a, b) => b.value - a.value); // value(対戦数)が大きい順にソートする
};

// 各クラスごとの勝率を計算する関数
const calculateWinRateByClass = (matches) => {
  const result = {};

  matches.forEach((match) => {
    const cls = match.opponentDeck;
    const isWin = match.result === "win";

    if (!result[cls]) {
      result[cls] = { win: 0, total: 0 };
    }
    result[cls].total += 1;
    if (isWin) result[cls].win += 1;
  });
  return CLASS_ORDER.map((cls) => {
    const data = result[cls];
    return {
      name: cls,
      winRate: data ? Math.round((data.win / data.total) * 100) : 0,
    };
  });
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

const CLASS_ORDER = Object.keys(CLASS_COLORS);

// WinRateGraph：親から対戦データを受け取り、グラフとして勝率を表示
const WinRateGraph = ({ matches, selectDeckId }) => {
  const filteredMatches = matches.filter(
    (match) => match.deckId === selectDeckId
  );

  const { win, lose, rate, chartData } = getTotalWinRateData(filteredMatches);
  const { firstRate, secondRate } = getFirstSecondRates(filteredMatches);
  const pieData = getOpponentClassDistribution(filteredMatches);
  const classWinRate = calculateWinRateByClass(filteredMatches);

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
        <Grid size={{ sx: 12, md: 4 }} sx={{ width: "100%", height: 250 }}>
          {/* ResponsiveContainer：親要素に高さを必ず含める */}
          <ResponsiveContainer width="100%" height="100%">
            {/* BarChart：dataを渡すとグラフが描画される */}
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#00BFFF" />
                <Cell fill="#eee" />
              </Pie>
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={20}
              >
                勝率
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fontWeight="bold"
              >
                {rate}%
              </text>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Typography variant="body2" sx={{ textAlign: "center", mb: 10 }}>
            先行 {firstRate}% / 後攻 {secondRate}%
          </Typography>
        </Grid>
        <Grid size={{ sx: 12, md: 4 }} sx={{ width: "100%", height: 250 }}>
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
                label={({ percent, x, y, index }) =>
                  `${(percent * 100).toFixed(0)}%`
                } // ← 小数第0位で%表示
              >
                {/* 各クラスごとにセクションを生成 */}
                {/* Cellで個別の色を設定 */}
                {/* COLORS[index % COLORS.length]で色を順番に割り当て */}
                {pieData.map((entry, index) => (
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
          sx={{
						display: "flex",
            justifyContent: "center",
            alignItems: "center",
						height: 250,
						pt: 2,
          }}
					>
          <Box>
            {classWinRate.map(({ name, winRate }) => (
							<Box
							key={name}
							sx={{
								display: "flex",
								alignItems: "center",
								mb: 1,
							}}
              >
                {/* 色アイコン */}
                <Box
                  sx={{
										width: 12,
                    height: 12,
                    bgcolor: CLASS_COLORS[name] || "#ccc",
                    mr: 1,
                  }}
									/>
                <Typography variant="body1" sx={{ mr: 1 }}>
                対 {name}：
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {winRate}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WinRateGraph;

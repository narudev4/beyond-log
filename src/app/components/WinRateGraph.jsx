import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Legend,
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

const getOpponentClassDistribution = (matches) => {
  const countMap = {};
  matches.forEach((match) => {
    const cls = match.opponentDeck;
    countMap[cls] = (countMap[cls] || 0) + 1;
  });
  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

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
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ width: "100%", height: 220, mb: "40px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography sx={{ textAlign: "center" }}>分布</Typography>
          <Box sx={{ width: "100%", height: 250, mb: "20px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  label={({ percent, x, y, index }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
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
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
            pt: 2,
          }}
        >
          <Box sx={{ mb: "20px" }}>
            {classWinRate.map(({ name, winRate }) => (
              <Box
                key={name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
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

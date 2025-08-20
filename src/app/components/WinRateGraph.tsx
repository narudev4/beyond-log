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
import type { Match, ClassName } from "@/types/domain";

interface WinRateGraphProps {
  matches: Match[];
  selectDeckId: string | null;
}

type PieDatum = { name: string; value: number };
type ClassWin = { name: ClassName; win: number; lose: number; winRate: number };

const CLASS_COLORS = {
  エルフ: "#4CAF50",
  ロイヤル: "#E6C200",
  ウィッチ: "#5C6BC0",
  ドラゴン: "#FF8C00",
  ナイトメア: "#A03B4C",
  ビショップ: "#DCD0C0",
  ネメシス: "#00CED1",
} as const satisfies Record<ClassName, string>;

const CLASS_ORDER = Object.keys(CLASS_COLORS) as ClassName[];

const getTotalWinRateData = (matches: Match[]) => {
  const total = matches.length;
  const win = matches.filter((m) => m.result === "win").length;
  const lose = total - win;
  const rate = total === 0 ? 0 : Math.round((win / total) * 100);
  const chartData: PieDatum[] = [
    { name: "勝利", value: win },
    { name: "敗北", value: lose },
  ];
  return {
    win,
    lose,
    rate,
    chartData,
  };
};

const getFirstSecondRates = (matches: Match[]) => {
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

const getOpponentClassDistribution = (matches: Match[]): PieDatum[] => {
  const countMap = new Map<string, number>();
  matches.forEach((match) => {
    countMap.set(match.opponentDeck, (countMap.get(match.opponentDeck) ?? 0) + 1);
  });
  return [...countMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const calculateWinRateByClass = (matches: Match[]): ClassWin[] => {
  const agg = new Map<ClassName, { win: number; total: number }>();
  matches.forEach((m) => {
    const key = m.opponentDeck as ClassName;
    const cur = agg.get(key) ?? { win: 0, total: 0 };
    cur.total += 1;
    if (m.result === "win") cur.win += 1;
    agg.set(key, cur);
  });
  return CLASS_ORDER.map((cls): ClassWin => {
    const d = agg.get(cls) ?? { win: 0, total: 0 };
    const winRate = d.total === 0 ? 0 : Math.round(( d.win / d.total) * 100);
    return {
      name: cls,
      win: d.win,
      lose: d.total - d.win,
      winRate,
    };
  });
};

const WinRateGraph: React.FC<WinRateGraphProps> = ({ matches, selectDeckId }) => {
  const filteredMatches = matches.filter((match) => match.deckId === selectDeckId);

  const { rate, chartData } = getTotalWinRateData(filteredMatches);
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
                  label={( p:any ) => `${(p.percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CLASS_COLORS[entry.name as ClassName] || "#8884d8"}
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
            {classWinRate.map(({ name, winRate, win, lose }) => (
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
                <Typography variant="body2" fontWeight="bold" sx={{ mr: 2 }}>
                  {winRate}%
                </Typography>
                <Typography variant="body2">
                  {win}勝 {lose}敗
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

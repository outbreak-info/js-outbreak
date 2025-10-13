import { schemeYlGnBu } from "d3-scale-chromatic";

export const choroColorScheme = schemeYlGnBu;
export const heatmapColorScheme = "RdPu";

export const defaultColor = "#3498db";

export const otherColor = "#bab0ab";

export const colorPalette = [
  "#4E79A7", // dk blue
  "#aecBe8", // lt blue
  "#f28e2b", // orange
  "#FFBE7D", // lt. orange
  "#59a14f", // green
  "#8CD17D", // lt. green
  "#e15759", // red
  "#FF9D9A", // lt. red
  "#499894", // teal
  "#86BCB6", // lt. teal
  "#B6992D", // dk yellow
  "#F1CE63", // yellow
  "#D37295", // dk pink
  "#FABFD2", // lt. pink,
  "#B07AA1", // dk purple
  "#D4A6C8", // lt. purple
  "#9D7660", // brown
  "#D7B5A6", // lt. brown
  "#bcbd22", // puce
  "#79706E", // grey
];

export const ylGnBuDiscrete11 = [
  "#ffffd9",
  "#eff9bd",
  "#d5eeb3",
  "#a9ddb7",
  "#73c9bd",
  "#45b4c2",
  "#2897bf",
  "#2073b2",
  "#234ea0",
  "#1c3185",
  "#081d58",
];

export const rdPuDiscrete11 = [
  "#fff7f3",
  "#fde4e1",
  "#fccfcc",
  "#fbb5bc",
  "#f993b0",
  "#f369a3",
  "#e03e98",
  "#c01788",
  "#99037c",
  "#700174",
  "#49006a",
];

// Diagonal hatch pattern
export const diagonalHatchPatternDef = (
  patternId = "diagonalHatch",
  strokeColor = "#a9a9a9",
  strokeWidth = 2
) => `
  <pattern
    id="${patternId}"
    width="5"
    height="5"
    patternTransform="rotate(45 0 0)"
    patternUnits="userSpaceOnUse"
  >
    <line
      x1="0"
      y1="0"
      x2="0"
      y2="10"
      style="stroke:${strokeColor}; stroke-width:${strokeWidth}"
    />
  </pattern>
`;

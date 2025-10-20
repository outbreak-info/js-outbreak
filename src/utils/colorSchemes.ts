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

// Select accessible color palette based on the number of categories
export const selectAccessibleColorPalette = (categoryArray: string | string[]) => {
  const numberOfItems = categoryArray.length;
  let colorPalette;
  if (categoryArray.includes('Other')) {
    switch (numberOfItems) {
      case 1:
        colorPalette = ['#b8b8b8'];
        break;
      case 2:
        colorPalette = ['#1a80bb', '#b8b8b8'];
        break;
      case 3:
        colorPalette = ['#1a80bb', '#ea801c', '#b8b8b8'];
        break;
      case 4:
        colorPalette = ["#4a2377", "#f55f74", "#0d7087", "#b8b8b8"];
        break;
      case 5:
        colorPalette = ['#082a54', '#e02b35', '#59a89c', '#a559aa', '#b8b8b8'];
        break;
      case 6:
        colorPalette = ['#082a54', '#e02b35', '#59a89c', '#a559aa', '#f0c571', '#e8e8e8'];
        break;
      case 7:
        colorPalette = ['#4477aa', '#66ccee', '#228833', '#ccbb44', '#ee6677', '#aa3377', '#bbbbbb'];
        break;
      case 8:
        colorPalette = ['#88ccee', '#cc6677', '#117733', '#ddcc77', '#882255', '#44aa99', '#999933', '#dddddd'];
        break;
      case 9:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', '#882255', '#44aa99', '#999933', '#dddddd'];
        break;
      default:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', '#882255', '#44aa99', '#999933', '#aa4499', '#dddddd'];
    }
  } else {
    switch (numberOfItems) {
      case 1:
        colorPalette = ['#1a80bb'];
        break;
      case 2:
        colorPalette = ['#1a80bb', '#ea801c'];
        break;
      case 3:
        colorPalette = ['#0f2080', '#f5793a', '#85c0f9'];
        break;
      case 4:
        colorPalette = ['#8cc5e3', '#f55f74', '#4a2377', '#0d7087'];
        break;
      case 5:
        colorPalette = ['#082a54', '#e02b35', '#f0c571', '#59a89c', '#a559aa'];
        break;
      case 6:
        colorPalette = ['#4477aa', '#66ccee', '#228833', '#ccbb44', '#ee6677', '#aa3377'];
        break;
      case 7:
        colorPalette = ['#88ccee', '#cc6677', '#117733', '#ddcc77', '#882255', '#44aa99', '#999933'];
        break;
      case 8:
        colorPalette = ['#88ccee', '#cc6677', '#117733', '#ddcc77', '#882255', '#44aa99', '#999933', '#aa4499'];
        break;
      case 9:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', '#882255', '#44aa99', '#999933', '#aa4499'];
        break;
      default:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', '#882255', '#44aa99', '#999933', '#aa4499', '#dddddd'];
    }
  }
  return colorPalette;
};

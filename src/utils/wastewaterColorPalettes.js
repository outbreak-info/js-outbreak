// select color palette for area chart
export const selectColorPalette = (lineageArray) => {
  const numberOfGroups = lineageArray.length;
  let colorPalette;
  if (lineageArray.includes('Other')) {
    switch (numberOfGroups) {
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
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', 
          '#882255', '#44aa99', '#999933', '#dddddd'];
        break;  
      default:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', 
          '#882255', '#44aa99', '#999933', '#aa4499', '#dddddd'];
    }
  } else {
    switch (numberOfGroups) {
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
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', 
          '#882255', '#44aa99', '#999933', '#aa4499'];
        break;  
      default:
        colorPalette = ['#332288', '#cc6677', '#ddcc77', '#117733', '#88ccee', 
          '#882255', '#44aa99', '#999933', '#aa4499', '#dddddd'];
    }
  }
  return colorPalette;
};

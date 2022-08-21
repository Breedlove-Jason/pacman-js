import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup";

class GameBoard {
  constructor(DOMGrid) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid = DOMGrid;
  }

  showGameStatus(gameWin) {
    const div = document.createElement("div");
    div.classList.add("game-status");
    div.innerHTML = `${gameWin ? "WIN!" : "GAME OVER"}`;
    this.DOMGrid.appendChild(div);
  }

  createGrid(level) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid.innerHTML = "";
    this.DOMGrid.style.cssext = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;

    level.forEach((square, index) => {
      const div = document.createElement("div");
      div.classList.add('square', CLASS_LIST[square]);
      div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
    });
  }
}

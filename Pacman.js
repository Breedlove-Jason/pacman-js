import { OBJECT_TYPE, DIRECTIONS } from "./setup.js";

class Pacman {
  constructor(speed, startPos) {
    this.pos = startPos;
    this.speed = speed;
    this.dir = null;
    this.queuedDir = null;
    this.timer = 0;
    this.powerPill = false;
    this.rotation = true;
  }

  shouldMove() {
    if (!this.dir) {
      return;
    }

    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }

    this.timer++;
  }

  getNextMove(objectExist) {
    if (this.queuedDir && !objectExist(this.pos + this.queuedDir.movement, OBJECT_TYPE.WALL) && !objectExist(this.pos + this.queuedDir.movement, OBJECT_TYPE.GHOSTLAIR)) {
      this.dir = this.queuedDir;
      this.queuedDir = null;
    }
    let nextMovePos = this.pos + this.dir.movement;
    if (
      objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
      objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)
    ) {
      nextMovePos = this.pos;
    }
    return { nextMovePos, direction: this.dir };
  }

  makeMove() {
    const classesToRemove = [OBJECT_TYPE.PACMAN];
    const classesToAdd = [OBJECT_TYPE.PACMAN];

    return { classesToRemove, classesToAdd };
  }

  setNewPos(nextMovePos) {
    this.pos = nextMovePos;
  }

  handleKeyInput(e, objectExist) {
    const aliases = {w:'ArrowUp', a:'ArrowLeft', s:'ArrowDown', d:'ArrowRight'};
    const dir = DIRECTIONS[aliases[e.key.toLowerCase()] || e.key];
    if (!dir) return;
    e.preventDefault();
    this.queuedDir = dir;
    if (!this.dir) this.dir = dir;
  }
}
export default Pacman;

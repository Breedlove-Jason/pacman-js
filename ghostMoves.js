import { DIRECTIONS, OBJECT_TYPE } from './setup.js';

// Choose from a finite set: an enclosed ghost waits instead of blocking the game.
export function randomMovement(position, direction, objectExist) {
  const valid = Object.values(DIRECTIONS).filter(dir =>
    !objectExist(position + dir.movement, OBJECT_TYPE.WALL) &&
    !objectExist(position + dir.movement, OBJECT_TYPE.GHOST));
  if (!valid.length) return {nextMovePos: position, direction};
  const dir = valid.includes(direction) ? direction : valid[Math.floor(Math.random() * valid.length)];
  return {nextMovePos: position + dir.movement, direction: dir};
}

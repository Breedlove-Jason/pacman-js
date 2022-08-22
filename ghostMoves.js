import { DIRECTIONS, OBJECT_TYPE } from "./setup";

// Primitive random movement

export function randomMovement(position, direction, objectExist) {
  let dir = direction;
  let nextMovePos = position + dir.movement;

  // create array from directions object keys
  const keys = Object.keys(DIRECTIONS);

  while (
    objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    objectExist(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    // get random direction
    const key = keys[Math.floor(Math.random() * keys.length)];
    dir = DIRECTIONS[key];
    nextMovePos = position + dir.movement;
  }
  return { nextMovePos, direction: dir };
}

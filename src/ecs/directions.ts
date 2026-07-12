import type { Rotation } from "./resources/player-state.resource";

export const DIRECTION_OFFSETS = {
  top: { x: 0, y: 0, z: -1 },
  right: { x: 1, y: 0, z: 0 },
  bottom: { x: 0, y: 0, z: 1 },
  left: { x: -1, y: 0, z: 0 },
} as const;

export type Direction = keyof typeof DIRECTION_OFFSETS;

// TODO Directions to enum/object?
export function getRotationFromDirection(dir: Direction) {
  switch (dir) {
    case "top":
      return 0;
    case "right":
      return 1;
    case "bottom":
      return 2;
    case "left":
      return 3;
  }
}

export function getDirectionFromRotation(rotation: Rotation) {
  switch (rotation % 4) {
    case 0:
      return "top";
    case 1:
      return "right";
    case 2:
      return "bottom";
    case 3:
      return "left";
    default:
      throw new Error(`Negative rotation: ${rotation}`);
  }
}

export function getOppositeDirection(dir: Direction) {
  switch (dir) {
    case "bottom":
      return "top";
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "left":
      return "right";
  }
}

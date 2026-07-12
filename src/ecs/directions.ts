export const DIRECTION_OFFSETS = {
  top: { x: 0, y: 0, z: -1 },
  right: { x: 1, y: 0, z: 0 },
  bottom: { x: 0, y: 0, z: 1 },
  left: { x: -1, y: 0, z: 0 },
} as const;

export type Direction = keyof typeof DIRECTION_OFFSETS;

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

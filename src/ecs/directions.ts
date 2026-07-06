export const NEIGHBOR_OFFSETS = {
  top: { dx: 0, dz: -1 },
  right: { dx: 1, dz: 0 },
  bottom: { dx: 0, dz: 1 },
  left: { dx: -1, dz: 0 },
} as const;

export function getOppositeDirection(dir: keyof typeof NEIGHBOR_OFFSETS) {
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

export type GameEvent = {
  type: "build";
  payload: { entityId: number; buildingType: string };
};

export type UserEvent =
  | { type: "click"; payload: { button: number; x: number; y: number } }
  | { type: "keypress"; payload: { key: string } }
  | { type: "mousemove"; payload: { x: number; y: number } };

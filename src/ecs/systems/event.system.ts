import { getPointerWorldPosition } from "../raycast";
import { System, type SystemContext } from "./system";

export class EventSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const lastMove = context
      .getResource("eventQueue")
      .userEvents.findLast((event) => event.type === "mousemove");

    if (lastMove) {
      const intersect = getPointerWorldPosition(
        lastMove.payload,
        context.camera,
        context.renderer,
      );

      context.getResource("playerState").intersect = {
        x: intersect.x,
        z: intersect.z,
      };
    }
  }
}

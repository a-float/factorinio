import { Entity } from "../entity/entity";
import { System, type SystemContext } from "./system";

export class ProductionSystem extends System {
  update(deltaTime: number, context: SystemContext): void {
    const entities = context.entityManager.queryEntities(["producer"]);
    for (const entity of entities) {
      const producerComp = Entity.getComponent(entity, "producer")!;
      if (producerComp.itemCount >= producerComp.maxItems) continue;

      producerComp.timePassed += deltaTime;
      const max = 1 / producerComp.itemsPerSecond;
      producerComp.itemCount += Math.floor(producerComp.timePassed / max);
      producerComp.timePassed %= max;
    }
  }
}

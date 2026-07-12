import { DIRECTION_OFFSETS, getOppositeDirection } from "../directions";
import { Entity } from "../entity/entity";
import { System, type SystemContext } from "./system";

export class InserterSystem extends System {
  update(deltaTime: number, context: SystemContext): void {
    const entities = context.entityManager.queryEntities(["inserter"]);
    for (const entity of entities) {
      const inserter = Entity.getComponent(entity, "inserter")!;
      const max = 1 / inserter.itemsPerSecond;
      inserter.timePassed = Math.min(max, inserter.timePassed + deltaTime);

      if (inserter.timePassed < max) continue;

      const { x, z } = Entity.getComponent(entity, "gridOccupant")!;
      const back = getOppositeDirection(inserter.next);
      const backOffset = DIRECTION_OFFSETS[back];
      // TODO The pattern below repeated a few times already. Consider extracting it somewhere.
      const sourceId = context
        .getResource("grid")
        .getEntityIdAtCell(x + backOffset.x, z + backOffset.z);
      if (!sourceId) continue;
      const sourceEntity = context.entityManager.getEntity(sourceId);
      if (!sourceEntity) continue;
      const producerComp = Entity.getComponent(sourceEntity, "producer");
      const sourceBeltComp = Entity.getComponent(sourceEntity, "belt");
      if (!producerComp && !sourceBeltComp) continue;

      const nextOffset = DIRECTION_OFFSETS[inserter.next];

      const targetId = context
        .getResource("grid")
        .getEntityIdAtCell(x + nextOffset.x, z + nextOffset.z);
      if (!targetId) continue;
      const targetEntity = context.entityManager.getEntity(targetId);
      if (!targetEntity) continue;

      const targetBeltComp = Entity.getComponent(targetEntity, "belt");
      if (!targetBeltComp) continue;

    if (producerComp && producerComp.itemCount > 0) {
        producerComp.itemCount--;
        targetBeltComp.items.push({ name: producerComp.item, distance: 0 });
      }
      if (sourceBeltComp && sourceBeltComp.items.length > 0) {
        const { name } = sourceBeltComp.items.pop()!;
        targetBeltComp.items.push({ name: name, distance: 0 });
      }
      inserter.timePassed = 0;
    }
  }
}

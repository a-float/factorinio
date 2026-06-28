import type { System, SystemContext } from "./system";
import * as THREE from "three";

export class RenderSystem implements System {
  entityMeshes: Map<number, THREE.Mesh> = new Map();

  update(_deltaTime: number, context: SystemContext): void {
    const entities = context.entityManager.queryEntities([
      "display",
      "gridOccupant",
    ]);

    for (const entity of entities) {
      const displayComponent = entity.getComponent("display")!;
      const { x, y } = entity.getComponent("gridOccupant")!;

      if (this.entityMeshes.has(entity.id)) continue;

      const size = 0.6;
      const geometry = new THREE.BoxGeometry(size, size, size);

      const material = new THREE.MeshBasicMaterial({
        color: displayComponent.color,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, geometry.parameters.height / 2 + 0.01, y);
      context.scene.add(cube);

      this.entityMeshes.set(entity.id, cube);
    }
  }
}

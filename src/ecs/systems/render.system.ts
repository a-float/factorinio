import type { System, SystemContext } from "./system";
import * as THREE from "three";

export class RenderSystem implements System {
  // TODO store mesh per type not entity
  entityMeshes: Map<number, THREE.Mesh> = new Map();

  update(_deltaTime: number, context: SystemContext): void {
    const entities = context.entityManager.queryEntities([
      "display",
      "gridOccupant",
    ]);

    for (const entity of entities) {
      const displayComponent = entity.getComponent("display")!;
      const { x, y, width, height } = entity.getComponent("gridOccupant")!;
      const isDeleted = entity.getComponent("deleted");

      if (!this.entityMeshes.has(entity.id)) {
        const scale = 0.8;
        const geometry = new THREE.BoxGeometry(
          width,
          displayComponent.height,
          height,
        ).scale(scale, 1, scale);
        // Place origin in "top left" corner
        geometry.translate(width / 2, 0, height / 2);

        const material = new THREE.MeshLambertMaterial({
          color: displayComponent.color,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.set(x, geometry.parameters.height / 2 + 0.01, y);
        context.scene.add(cube);

        this.entityMeshes.set(entity.id, cube);
      }

      if (isDeleted) {
        const mesh = this.entityMeshes.get(entity.id)!;
        context.scene.remove(mesh);
        this.entityMeshes.delete(entity.id);
      }
    }
  }
}

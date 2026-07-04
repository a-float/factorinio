import { BuildingEntity } from "../entity/building.entity";
import type { System, SystemContext } from "./system";
import * as THREE from "three";

export class RenderSystem implements System {
  // TODO store mesh per type not entity
  entityMeshes: Map<number, THREE.Object3D> = new Map();

  update(_deltaTime: number, context: SystemContext): void {
    const entities = context.entityManager.queryEntities([
      "display",
      "gridOccupant",
    ]);

    for (const entity of entities) {
      const displayComponent = entity.getComponent("display")!;
      const { x, y, width, height } = entity.getComponent("gridOccupant")!;
      const isDeleted = entity.getComponent("deleted");

      if (!this.entityMeshes.has(entity.id) || displayComponent.isDirty) {
        displayComponent.setDirty(false);
        const maybePrevMesh = this.entityMeshes.get(entity.id);
        if (maybePrevMesh) {
          context.scene.remove(maybePrevMesh);
        }

        // TODO Control this via the DisplayComponent
        if (entity instanceof BuildingEntity && entity.name === "Basic Belt") {
          const group = new THREE.Group();
          const networkComp = entity.getComponent("network")!;

          const rect = new THREE.BoxGeometry(0.3333, 0.2, 0.3333);
          group.add(
            new THREE.Mesh(
              rect,
              new THREE.MeshLambertMaterial({ color: 0x11bb33 }),
            ),
          );

          for (const [key, value] of Object.entries(networkComp.neighbours)) {
            if (!value) continue;
            let rect;
            if (key === "top") {
              rect = new THREE.BoxGeometry(0.3333, 0.2, 0.6666);
              rect.translate(0, 0, -0.3333);
            } else if (key === "bottom") {
              rect = new THREE.BoxGeometry(0.3333, 0.2, 0.6666);
              rect.translate(0, 0, 0.3333);
            } else if (key === "right") {
              rect = new THREE.BoxGeometry(0.6666, 0.2, 0.3333);
              rect.translate(0.3333, 0, 0);
            } else if (key === "left") {
              rect = new THREE.BoxGeometry(0.6666, 0.2, 0.3333);
              rect.translate(-0.3333, 0, 0);
            }

            group.add(
              new THREE.Mesh(
                rect,
                new THREE.MeshLambertMaterial({ color: 0x11bb33 }),
              ),
            );
          }
          group.position.set(x + 0.5, 0, y + 0.5);
          context.scene.add(group);
          this.entityMeshes.set(entity.id, group);
        } else {
          const margin = new THREE.Vector3(0.3, 0.01, 0.3);
          const size = new THREE.Vector3(
            width,
            displayComponent.height,
            height,
          );
          const geometry = new THREE.BoxGeometry(...size.sub(margin).toArray());

          // Place origin in "top left" corner
          geometry.translate(
            width / 2,
            displayComponent.height / 2,
            height / 2,
          );

          const material = new THREE.MeshLambertMaterial({
            color: displayComponent.color,
          });
          const cube = new THREE.Mesh(geometry, material);
          cube.castShadow = true;
          cube.receiveShadow = true;
          cube.position.set(x, 0, y);
          context.scene.add(cube);

          this.entityMeshes.set(entity.id, cube);
        }
      }

      if (isDeleted) {
        const mesh = this.entityMeshes.get(entity.id)!;
        context.scene.remove(mesh);
        this.entityMeshes.delete(entity.id);
      }
    }
  }
}

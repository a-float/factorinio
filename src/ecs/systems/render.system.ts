import type { DisplayComponent } from "../components/display.component";
import type { GridOccupantComponent } from "../components/grid-occupant.component";
import type { NetworkComponent } from "../components/network.component";
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
      if (entity.getComponent("deleted")) {
        const mesh = this.entityMeshes.get(entity.id)!;
        context.scene.remove(mesh);
        this.entityMeshes.delete(entity.id);
        continue;
      }

      const displayComponent = entity.getComponent("display")!;
      const gridOccupantComponent = entity.getComponent("gridOccupant")!;

      if (!this.entityMeshes.has(entity.id) || displayComponent.isDirty) {
        displayComponent.setDirty(false);
        const maybePrevMesh = this.entityMeshes.get(entity.id);
        if (maybePrevMesh) {
          context.scene.remove(maybePrevMesh);
        }

        const networkComponent = entity.getComponent("network");
        const newMesh = networkComponent
          ? this.createNetworkMesh(
              gridOccupantComponent,
              displayComponent,
              networkComponent,
            )
          : this.createGridOccupantMesh(
              gridOccupantComponent,
              displayComponent,
            );

        context.scene.add(newMesh);
        this.entityMeshes.set(entity.id, newMesh);
      }
    }
  }

  createGridOccupantMesh(
    { x, y, width, height }: GridOccupantComponent,
    displayComponent: DisplayComponent,
  ) {
    const margin = new THREE.Vector3(0.3, 0.01, 0.3);
    const size = new THREE.Vector3(width, displayComponent.height, height);
    const geometry = new THREE.BoxGeometry(...size.sub(margin).toArray());

    // Place origin in "top left" corner
    geometry.translate(width / 2, displayComponent.height / 2, height / 2);

    const material = new THREE.MeshLambertMaterial({
      color: displayComponent.color,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(x, 0, y);

    return cube;
  }

  createNetworkMesh(
    { x, y }: GridOccupantComponent,
    _displayComponent: DisplayComponent,
    networkComponent: NetworkComponent,
  ) {
    const group = new THREE.Group();

    const rect = new THREE.BoxGeometry(0.3333, 0.2, 0.3333);
    group.add(
      new THREE.Mesh(rect, new THREE.MeshLambertMaterial({ color: 0x11bb33 })),
    );

    for (const [key, value] of Object.entries(networkComponent.neighbours)) {
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
    return group;
  }
}

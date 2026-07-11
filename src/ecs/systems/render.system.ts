import type { BeltComponent } from "../components/belt.component";
import type { DisplayComponent } from "../components/display.component";
import type { GridOccupantComponent } from "../components/grid-occupant.component";
import type { NetworkComponent } from "../components/network.component";
import { Entity } from "../entity/entity";
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
      if (Entity.getComponent(entity, "deleted")) {
        const mesh = this.entityMeshes.get(entity.id)!;
        context.scene.remove(mesh);
        this.entityMeshes.delete(entity.id);
        continue;
      }

      const displayComponent = Entity.getComponent(entity, "display")!;
      const gridOccupantComponent = Entity.getComponent(
        entity,
        "gridOccupant",
      )!;

      if (!this.entityMeshes.has(entity.id) || displayComponent.isDirty) {
        displayComponent.isDirty = false;
        const maybePrevMesh = this.entityMeshes.get(entity.id);
        if (maybePrevMesh) {
          context.scene.remove(maybePrevMesh);
        }

        const networkComponent = Entity.getComponent(entity, "network");
        const beltComponent = Entity.getComponent(entity, "belt");
        const newMesh = networkComponent
          ? RenderSystem.createNetworkMesh(displayComponent, networkComponent)
          : beltComponent
            ? RenderSystem.createBeltMesh(displayComponent, beltComponent)
            : RenderSystem.createGridOccupantMesh(
                gridOccupantComponent,
                displayComponent,
              );

        const { x, y } = gridOccupantComponent;
        newMesh.position.set(x, 0, y);
        context.scene.add(newMesh);
        this.entityMeshes.set(entity.id, newMesh);
      }
    }
  }

  static createGridOccupantMesh(
    { width, height }: Pick<GridOccupantComponent, "width" | "height">,
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

    return cube;
  }

  static createBeltMesh(
    _displayComponent: DisplayComponent,
    beltComponent: BeltComponent,
  ) {
    const group = new THREE.Group();
    const [thickness, height, length] = [0.5, 0.2, 0.3333];
    const rects = [new THREE.BoxGeometry(thickness, height, thickness)];

    for (const dir of [beltComponent.prev, beltComponent.next]) {
      let rect;
      if (dir === "top") {
        rect = new THREE.BoxGeometry(thickness, height, length);
        rect.translate(0, 0, -length);
      } else if (dir === "bottom") {
        rect = new THREE.BoxGeometry(thickness, height, length);
        rect.translate(0, 0, length);
      } else if (dir === "right") {
        rect = new THREE.BoxGeometry(length, height, thickness);
        rect.translate(length, 0, 0);
      } else if (dir === "left") {
        rect = new THREE.BoxGeometry(length, height, thickness);
        rect.translate(-length, 0, 0);
      }

      if (rect) rects.push(rect);
    }

    rects.forEach((rect, idx) => {
      rect.translate(0.5, 0, 0.5);
      // Distinguish prev
      const color = idx === 1 ? 0x1144dd : 0x44aaff;
      group.add(new THREE.Mesh(rect, new THREE.MeshLambertMaterial({ color })));
    });

    return group;
  }

  static createNetworkMesh(
    _displayComponent: DisplayComponent,
    networkComponent: NetworkComponent,
  ) {
    const group = new THREE.Group();

    const [thickness, height, length] = [0.3333, 0.2, 0.3333];
    const rects = [new THREE.BoxGeometry(thickness, height, thickness)];
    for (const [key, value] of Object.entries(networkComponent.neighbours)) {
      if (!value) continue;
      let rect;
      if (key === "top") {
        rect = new THREE.BoxGeometry(thickness, height, length);
        rect.translate(0, 0, -length);
      } else if (key === "bottom") {
        rect = new THREE.BoxGeometry(thickness, height, length);
        rect.translate(0, 0, length);
      } else if (key === "right") {
        rect = new THREE.BoxGeometry(length, height, thickness);
        rect.translate(length, 0, 0);
      } else if (key === "left") {
        rect = new THREE.BoxGeometry(length, height, thickness);
        rect.translate(-length, 0, 0);
      }

      if (rect) rects.push(rect);
    }

    const material = new THREE.MeshLambertMaterial({ color: 0xaaaa22 });
    for (const rect of rects) {
      rect.translate(0.5, 0, 0.5);
      group.add(new THREE.Mesh(rect, material));
    }

    return group;
  }

  reset() {
    for (const obj of this.entityMeshes.values()) {
      const scene = obj.parent as THREE.Scene | null;
      scene?.remove(obj);
    }
    this.entityMeshes.clear();
  }
}

import * as THREE from "three";
import { System, type SystemContext } from "./system";

export class GridDisplaySystem extends System {
  private readonly cellMarkers = new Map<string, THREE.Mesh>();

  update(_deltaTime: number, context: SystemContext): void {
    if (!context.getResource("config").enableGridDebug) {
      this.cellMarkers.forEach((marker) => {
        context.scene.remove(marker);
      });
      this.cellMarkers.clear();
      return;
    }

    const grid = context.getResource("grid");
    const occupied = new Set<string>();

    for (const [key] of grid.occupiedCells) {
      occupied.add(key);
    }

    for (const [key, marker] of this.cellMarkers.entries()) {
      if (!occupied.has(key)) {
        context.scene.remove(marker);
        this.cellMarkers.delete(key);
      }
    }

    for (const key of occupied) {
      if (!this.cellMarkers.has(key)) {
        const [x, y] = key.split(",").map(Number);
        const marker = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 4, 0.1),
          new THREE.MeshBasicMaterial({
            color: 0x55ff88,
            transparent: true,
            opacity: 0.5,
          }),
        );
        marker.position.set(x + 0.5, 2, y + 0.5);
        context.scene.add(marker);
        this.cellMarkers.set(key, marker);
      }
    }
  }
}

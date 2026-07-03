import { mouseToWorldCoordinates } from "../raycast";
import type { Tool } from "../resources/player-state.resource";
import { System, type SystemContext } from "./system";
import * as THREE from "three";

export class CursorSystem extends System {
  private prevTool: Tool | null = null;
  private meshMap = new Map<string, THREE.Mesh>();
  private mesh: THREE.Mesh | null = null;

  private getMesh = (tool: Tool) => {
    if (!this.meshMap.has(tool.icon)) {
      if (tool.type === "build") {
        const scale = 0.79;
        const size = tool.prototype.size;
        const geometry = new THREE.BoxGeometry(...size.toArray()).scale(
          scale,
          0.95,
          scale,
        );

        geometry.translate(size.x / 2, size.y / 2, size.z / 2);

        const material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(tool.prototype.color).multiplyScalar(1.5),
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.meshMap.set(tool.icon, cube);
      } else {
        const deleteMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xff5555,
          }),
        );
        deleteMesh.geometry.rotateX(-Math.PI / 2);
        deleteMesh.geometry.translate(0.5, 0, 0.5);
        this.meshMap.set(tool.icon, deleteMesh);
      }
    }
    return this.meshMap.get(tool.icon)!;
  };

  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").userEvents;
    const playerState = context.getResource("playerState");
    const activeTool = playerState.getActiveTool();

    if (this.prevTool !== activeTool) {
      const newMesh = this.getMesh(activeTool);
      if (this.mesh) {
        context.scene.remove(this.mesh);
        newMesh.position.copy(this.mesh.position);
      }
      context.scene.add(newMesh);
      this.mesh = newMesh;
      this.prevTool = activeTool;
    }

    const lastMove = events.findLast((event) => event.type === "mousemove");

    if (lastMove) {
      const { x, y } = lastMove.payload;
      const intersect = mouseToWorldCoordinates(
        x,
        y,
        context.camera,
        context.renderer,
      );
      this.mesh?.position.set(intersect.x, 0.0, intersect.z);
    }
  }
}

import { getRotatedFootprint } from "../components/grid-occupant.component";
import { getPointerWorldPosition, type PointerCoordinates } from "../raycast";
import type { Tool } from "../resources/player-state.resource";
import { System, type SystemContext } from "./system";
import * as THREE from "three";

export class CursorSystem extends System {
  private prevTool: Tool | null = null;
  private meshMap = new Map<string, THREE.Mesh>();
  private mesh: THREE.Mesh | null = null;
  private lastPointer: PointerCoordinates | null = null;

  private getMesh = (tool: Tool) => {
    if (!this.meshMap.has(tool.icon)) {
      if (tool.type === "build") {
        const size = tool.prototype.size;
        const margin = new THREE.Vector3(0.3, 0.01, 0.3);
        const geometry = new THREE.BoxGeometry(
          ...size.clone().sub(margin).toArray(),
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
        deleteMesh.geometry.translate(0.5, 0.001, 0.5);
        this.meshMap.set(tool.icon, deleteMesh);
      }
    }
    return this.meshMap.get(tool.icon)!;
  };

  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").userEvents;
    const playerState = context.getResource("playerState");
    const activeTool = playerState.getActiveTool();
    const rotation = playerState.getRotation();

    if (this.prevTool !== activeTool) {
      if (this.mesh) context.scene.remove(this.mesh);
      this.mesh = this.getMesh(activeTool);
      context.scene.add(this.mesh);
      this.prevTool = activeTool;
    }

    if (!this.mesh) return;

    const lastMove = events.findLast((event) => event.type === "mousemove");
    if (lastMove) {
      this.lastPointer = lastMove.payload;
    }

    if (!this.lastPointer) return;

    const intersect = getPointerWorldPosition(
      this.lastPointer,
      context.camera,
      context.renderer,
    );

    if (activeTool.type === "build") {
      let diff = new THREE.Vector3();
      if (rotation === 1) {
        diff.set(1, 0, 0);
      } else if (rotation === 2) {
        diff.set(1, 0, 1);
      } else if (rotation === 3) {
        diff.set(0, 0, 1);
      }

      const { width, height } = getRotatedFootprint(
        activeTool.prototype.size.x,
        activeTool.prototype.size.z,
        rotation,
      );

      diff = diff.multiply({ x: width, y: 0, z: height });

      this.mesh.rotation.y = (-rotation * Math.PI) / 2;
      this.mesh.position.set(intersect.x, 0.0, intersect.z);
      this.mesh.position.add(diff);
    } else {
      this.mesh.position.set(intersect.x, 0.0, intersect.z);
    }
  }
}

import { mx_bilerp_0 } from "three/src/nodes/materialx/lib/mx_noise.js";
import { BeltComponent } from "../components/belt.component";
import { DisplayComponent } from "../components/display.component";
import { getRotatedFootprint } from "../components/grid-occupant.component";
import { getPointerWorldPosition, type PointerCoordinates } from "../raycast";
import type { Rotation, Tool } from "../resources/player-state.resource";
import { RenderSystem } from "./render.system";
import { System, type SystemContext } from "./system";
import * as THREE from "three";
import { BeltSystem } from "./belt.system";

export class CursorSystem extends System {
  private prevTool: Tool | null = null;
  private meshMap = new Map<string, THREE.Object3D>();
  private mesh: THREE.Object3D | null = null;
  private lastPointer: PointerCoordinates | null = null;
  private prevRotation: Rotation = 0;

  private getMesh = (tool: Tool, rotation: Rotation) => {
    if (!this.meshMap.has(tool.icon) || this.prevRotation !== rotation) {
      // TODO Don't use prototype name
      if (tool.type === "build" && tool.prototype.name === "Basic Belt") {
        const { prev, next } = BeltSystem.getBeltConfigForRotation(rotation);
        console.log("cursor", { rotation, prev, next });
        const mesh = RenderSystem.createBeltMesh(
          new DisplayComponent(10, 0xbababa),
          new BeltComponent(prev, next),
        );
        this.meshMap.set(tool.icon, mesh);
      } else if (tool.type === "build") {
        const size = tool.prototype.size;
        const mesh = RenderSystem.createGridOccupantMesh(
          { width: size.x, height: size.z },
          new DisplayComponent(
            size.y,
            new THREE.Color(tool.prototype.color).multiplyScalar(1.5),
          ),
        );
        this.meshMap.set(tool.icon, mesh);
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

    // TODO I don't want to rebuild mesh on every rotate
    if (this.prevTool !== activeTool || rotation !== this.prevRotation) {
      if (this.mesh) context.scene.remove(this.mesh);
      this.mesh = this.getMesh(activeTool, rotation);
      context.scene.add(this.mesh);
      this.prevTool = activeTool;
      this.prevRotation = rotation;
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
      const { width, height } = getRotatedFootprint(
        activeTool.prototype.size.x,
        activeTool.prototype.size.z,
        rotation,
      );
      this.mesh.position.set(intersect.x, 0.0, intersect.z);

      // TODO Handle it without this edge case
      if (activeTool.prototype.name !== "Basic Belt") {
        let diff = new THREE.Vector3();
        let mod4 = rotation % 4;
        if (mod4 === 1) {
          diff.set(1, 0, 0);
        } else if (mod4 === 2) {
          diff.set(1, 0, 1);
        } else if (mod4 === 3) {
          diff.set(0, 0, 1);
        }

        diff = diff.multiply({ x: width, y: 0, z: height });

        this.mesh.rotation.y = (-rotation * Math.PI) / 2;
        this.mesh.position.add(diff);
      }
    } else {
      this.mesh.position.set(intersect.x, 0.0, intersect.z);
    }
  }
}

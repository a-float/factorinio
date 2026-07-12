import { BeltComponent } from "../components/belt.component";
import { DisplayComponent } from "../components/display.component";
import { getRotatedFootprint } from "../components/grid-occupant.component";
import type { Tool } from "../resources/player-state.resource";
import { RenderSystem } from "./render.system";
import { System, type SystemContext } from "./system";
import * as THREE from "three";
import { BeltSystem } from "./belt.system";
import { InserterComponent } from "../components/inserter.component";
import { getDirectionFromRotation } from "../directions";

export class CursorSystem extends System {
  private mesh: THREE.Object3D | null = null;

  // TODO Maybe do not recreate the mesh on every update?
  private getMesh = (tool: Tool, context: SystemContext) => {
    // TODO get rid of edge cases?
    if (tool.type === "build" && tool.prototype.name === "Basic Belt") {
      const { prev, next } = BeltSystem.getBeltConfigForCellAndRotation(
        context.getResource("playerState").intersect,
        context,
      );
      const mesh = RenderSystem.createBeltMesh(
        new DisplayComponent(9999, 0xbababa), // height ignored
        new BeltComponent(prev, next),
      );
      return mesh;
    } else if (tool.type === "build" && tool.prototype.name === "Inserter") {
      const rotation = context.getResource("playerState").getRotation();
      const mesh = RenderSystem.createInserterMesh(
        new DisplayComponent(
          9999, // height ignored
          new THREE.Color(tool.prototype.color).multiplyScalar(1.5),
        ),
        new InserterComponent(getDirectionFromRotation(rotation)),
      );
      return mesh;
    } else if (tool.type === "build") {
      const size = tool.prototype.size;
      const mesh = RenderSystem.createGridOccupantMesh(
        { width: size.x, height: size.z },
        new DisplayComponent(
          size.y,
          new THREE.Color(tool.prototype.color).multiplyScalar(1.5),
        ),
      );
      return mesh;
    } else if (tool.type === "destroy") {
      const deleteMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          color: 0xff5555,
        }),
      );
      deleteMesh.geometry.rotateX(-Math.PI / 2);
      deleteMesh.geometry.translate(0.5, 0.001, 0.5);
      return deleteMesh;
    }
    return null;
  };

  update(_deltaTime: number, context: SystemContext): void {
    const playerState = context.getResource("playerState");
    const activeTool = playerState.getActiveTool();
    const intersect = playerState.intersect;
    const rotation = playerState.getRotation();

    if (this.mesh) context.scene.remove(this.mesh);
    this.mesh = this.getMesh(activeTool, context);

    if (!this.mesh) return;
    if (!intersect) return;

    context.scene.add(this.mesh);
    if (activeTool.type === "build") {
      const { width, height } = getRotatedFootprint(
        activeTool.prototype.size.x,
        activeTool.prototype.size.z,
        rotation,
      );
      this.mesh.position.set(intersect.x, 0.0, intersect.z);

      // TODO Handle it without this edge case
      if (
        activeTool.prototype.name !== "Basic Belt" &&
        activeTool.prototype.name !== "Inserter"
      ) {
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

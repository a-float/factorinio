import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EntityManager } from "./entity-manager";
import { EventQueueResource } from "./resources/event-queue.resource";
import { GridResource } from "./resources/grid.resource";
import type { System } from "./systems/system";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { registerListeners } from "./events/event.listeners";
import { PlayerStateResource } from "./resources/player-state.resource";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ConfigResource } from "./resources/config.resource";

export class World {
  entityManager: EntityManager = new EntityManager();
  systems: System[] = [];
  resources = {
    eventQueue: new EventQueueResource(),
    grid: new GridResource(),
    playerState: new PlayerStateResource(),
    config: new ConfigResource(),
  };
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  constructor() {
    this.scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    window.world = this;
    registerListeners();
  }

  setup() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var stats = new Stats();
    const panels = Array.from(stats.dom.children) as HTMLElement[];
    panels.forEach((panel, index) => {
      panel.style.display = "block";
      panel.style.position = "absolute";
      panel.style.top = "8px";
      panel.style.left = `${6 + index * 85}px`;
      document.body.appendChild(panel);
    });

    let clock = new THREE.Clock();
    let delta = 0;
    let interval = 1 / 60;

    const animate = () => {
      delta += clock.getDelta();
      if (delta > interval) {
        controls.update();
        this.renderer.render(this.scene, this.camera);

        this.update(delta); // TODO check if the right
        stats.update();
        delta = delta % interval;
      }
    };

    this.renderer.setAnimationLoop(animate);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 10, 10);
    controls.update();

    const size = 100;
    const divisions = 100;

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0x121212,
      }),
    );
    planeMesh.receiveShadow = true;
    planeMesh.rotateX(-Math.PI / 2);
    this.scene.add(planeMesh);

    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = 1e-1;
    this.scene.add(gridHelper);

    const sunlight = new THREE.DirectionalLight(0xffffff, 1);
    sunlight.lookAt(5, 0, 10);
    sunlight.position.set(10, 30, 20);
    sunlight.castShadow = true;
    this.scene.add(sunlight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    sunlight.shadow.mapSize.width = 2048;
    sunlight.shadow.mapSize.height = 2048;

    this.setupGUI();
  }

  getResource<K extends keyof typeof this.resources>(
    resourceName: K,
  ): (typeof this.resources)[K] {
    return this.resources[resourceName];
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  update(deltaTime: number): void {
    const context = {
      entityManager: this.entityManager,
      getResource: this.getResource.bind(this),
      camera: this.camera,
      renderer: this.renderer,
      scene: this.scene,
    };
    for (const system of this.systems) {
      system.update(deltaTime, context);
    }

    // Handles deletion scheduling and flush
    this.entityManager.update();

    // Clear user events after processing
    this.resources.eventQueue.userEvents.length = 0;
  }

  // https://lil-gui.georgealways.com/
  private setupGUI() {
    const gui = new GUI();

    gui.add(this.resources.config, "enableGridDebug").name("Enable Grid Debug");
  }
}

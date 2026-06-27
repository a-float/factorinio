import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

window.addEventListener("resize", onWindowResize);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 10);
controls.update();

const size = 100;
const divisions = 101;

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(size, size),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0x121212,
  }),
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);

const gridHelper = new THREE.GridHelper(divisions, 100);
gridHelper.position.y = 1e-1;
scene.add(gridHelper);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xaff,
  }),
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.addScalar(0.5);
highlightMesh.position.y = 1.1e-1;
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const highlightPos = new THREE.Vector3()
      .copy(intersects[0].point)
      .floor()
      .addScalar(0.5);
    highlightMesh.position.set(
      highlightPos.x,
      highlightMesh.position.y,
      highlightPos.z,
    );
  }
});

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

function animate() {
  delta += clock.getDelta();
  if (delta > interval) {
    controls.update();
    renderer.render(scene, camera);

    renderer.render(scene, camera);
    stats.update();
    delta = delta % interval;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

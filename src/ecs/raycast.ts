import * as THREE from "three";

export type PointerCoordinates = {
  x: number;
  y: number;
};

export function mouseToWorldCoordinates(
  mouseX: number,
  mouseY: number,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
): THREE.Vector3 {
  const mouse = new THREE.Vector2();
  mouse.x = (mouseX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(mouseY / renderer.domElement.clientHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectionPoint);

  return intersectionPoint.floor();
}

export function getPointerWorldPosition(
  pointer: PointerCoordinates,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
): THREE.Vector3 {
  return mouseToWorldCoordinates(pointer.x, pointer.y, camera, renderer);
}

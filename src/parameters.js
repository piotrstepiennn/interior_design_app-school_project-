import * as BABYLON from "babylonjs";

export const parameters = {
  //preDeclarations
  gui: null,
  canvas: null,
  scene: null,
  ground: null,
  camera: null,
  lights: null,
  placedMeshes: [],
  selectedWallScheme: ["NORTH", "SOUTH", "WEST", "EAST"],
  walls: [],
  wallMaterial: null,
  isMeshPicked: false,
  paintPickedMesh: false,
  showPickedMesh: true,
  highlightedMesh: null,
  pickedMesh: null,
  products: null,
  // Parameters
  groundWidth: 15000,
  groundHeigth: 10000,
  wallSize: 3000,
  categories: ["Szafka Dolna", "Szafka Górna", "AGD"],
};

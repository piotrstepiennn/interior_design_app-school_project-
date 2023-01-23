import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { parameters } from "./parameters";
import { SceneBuilder, prepareWalls } from "./sceneBuilder";
import { RoomDesignGUI } from "./gui";
import { FurnitureGUI } from "./furnitureGUI";

window.addEventListener("DOMContentLoaded", function () {
  parameters.canvas = document.getElementById("canvas");
  let engine = new BABYLON.Engine(parameters.canvas, true);

  let createScene = function () {
    SceneBuilder.prepareScene(engine);
    SceneBuilder.setLights();
    SceneBuilder.prepareGround();
    SceneBuilder.prepareCamera();
    prepareWalls();

    parameters.gui = new RoomDesignGUI();
    parameters.furnitureGui = new FurnitureGUI();
    return parameters.scene;
  };

  let scene = createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
});

import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { parameters } from "./parameters";
import { SceneBuilder } from "./sceneBuilder";

window.addEventListener("DOMContentLoaded", function () {
  parameters.canvas = document.getElementById("canvas");
  let engine = new BABYLON.Engine(parameters.canvas, true);

  let createScene = function () {
    SceneBuilder.prepareScene(engine);
    SceneBuilder.setLights();
    SceneBuilder.prepareGround();
    SceneBuilder.prepareCamera();
    SceneBuilder.prepareWalls();

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
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { parameters } from "./parameters";
import { SceneBuilder, prepareWalls } from "./sceneBuilder";
import { RoomDesignGUI } from "./gui";
import { FurnitureGUI } from "./furnitureGUI";
import { createProductList } from "./models";
import { MeshGenerator } from "./meshGenerator";
import { Tools } from "./tools";

window.addEventListener("DOMContentLoaded", function () {
  parameters.canvas = document.getElementById("canvas");
  let engine = new BABYLON.Engine(parameters.canvas, true);

  let createScene = function () {
    SceneBuilder.prepareScene(engine);
    SceneBuilder.preCreatePickedMesh();
    SceneBuilder.setLights();
    SceneBuilder.prepareGround();
    SceneBuilder.prepareCamera();
    prepareWalls();

    //Cursor Pointer
    let origin = MeshGenerator.createPointer();

    parameters.products = createProductList();

    parameters.scene.registerBeforeRender(() => {
      // Polishing the highlited mesh
      if (parameters.highlightedMesh) {
        parameters.placedMeshes.map((object) => {
          if (parameters.highlightedMesh == object) {
            object.material.emissiveColor = new BABYLON.Color3.FromHexString(
              "#ff8400"
            );
          } else {
            object.material.emissiveColor = new BABYLON.Color3.Black();
          }
        });
      }
      // mechanics of selected mesh
      if (parameters.isMeshPicked) {
        // only works when selected to place any mesh
        // transfer of mouse position to coordinate plane
        let pickResult = parameters.scene.pick(
          parameters.scene.pointerX,
          parameters.scene.pointerY
        );
        if (pickResult.hit) {
          // let mousePosition = new BABYLON.Vector3(pickResult.pickedPoint.x, parameters.originHeight, pickResult.pickedPoint.z)
          // origin.position = mousePosition

          // if (origin.intersectsMesh(parameters.ground, false)) {
          parameters.pickedMesh.position.x = origin.position.x;
          parameters.pickedMesh.position.z = origin.position.z;
          // }

          let leftCollider = parameters.pickedMesh
            .getChildMeshes()
            .filter((child) => child.name == "left")[0];
          let rightCollider = parameters.pickedMesh
            .getChildMeshes()
            .filter((child) => child.name == "right")[0];
          let backCollider = parameters.pickedMesh
            .getChildMeshes()
            .filter((child) => child.name == "back")[0];

          // Let it touch the walls?
          let backIntersectedWall = null;
          parameters.walls.map((wall) =>
            backCollider.intersectsMesh(wall, false)
              ? (backIntersectedWall = wall)
              : ""
          );

          let rightInersectedWall = null;
          parameters.walls.map((wall) =>
            rightCollider.intersectsMesh(wall, false)
              ? (rightInersectedWall = wall)
              : ""
          );

          let leftIntersectedWall = null;
          parameters.walls.map((wall) =>
            leftCollider.intersectsMesh(wall, false)
              ? (leftIntersectedWall = wall)
              : ""
          );

          // Let it touch other wipes?
          let rightIntersectedMesh = null;
          parameters.placedMeshes.map((obj) =>
            leftCollider.intersectsMesh(obj, false)
              ? (rightIntersectedMesh = obj)
              : ""
          );

          let leftIntersectedMesh = null;
          parameters.placedMeshes.map((obj) =>
            rightCollider.intersectsMesh(obj, false)
              ? (leftIntersectedMesh = obj)
              : ""
          );

          // rear surface to wall contact
          if (backIntersectedWall) {
            let rotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              parameters.rotationAmount
            );
            let wallRotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              backIntersectedWall.rotation.y
            );
            if (rotationVector.x == 1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
            } else if (rotationVector.x == -1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
            } else if (rotationVector.z == 1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
            } else if (rotationVector.z == -1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
            }
          }

          let collision = false;
          collision =
            parameters.placedMeshes.filter((obj) =>
              obj
                .getChildMeshes()
                .filter((col) => col.name == "front")[0]
                .intersectsMesh(parameters.pickedMesh, false)
            ).length > 0;
          let innerMesh = parameters.pickedMesh
            .getChildren()
            .filter((child) => child.name == "inner")[0];
          parameters.walls.filter((wall) =>
            wall.intersectsMesh(innerMesh, true)
          ).length > 0
            ? (collision = true)
            : "";
          parameters.placedMeshes.filter((obj) =>
            obj.intersectsMesh(innerMesh, true)
          ).length > 0
            ? (collision = true)
            : "";
          // mesh contact from the right surface
          if (rightIntersectedMesh && !collision) {
            let rotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              parameters.rotationAmount
            );
            if (rotationVector.z == 1) {
              parameters.pickedMesh.position.x =
                rightIntersectedMesh.position.x +
                rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize
                  .x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.z == -1) {
              parameters.pickedMesh.position.x =
                rightIntersectedMesh.position.x -
                rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize
                  .x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == 1) {
              parameters.pickedMesh.position.z =
                rightIntersectedMesh.position.z -
                rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize
                  .x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == -1) {
              parameters.pickedMesh.position.z =
                rightIntersectedMesh.position.z +
                rightIntersectedMesh.getBoundingInfo().boundingBox.extendSize
                  .x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            }
          }
          // mesh contact from left surface
          else if (leftIntersectedMesh && !collision) {
            let rotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              parameters.rotationAmount
            );
            if (rotationVector.z == 1) {
              parameters.pickedMesh.position.x =
                leftIntersectedMesh.position.x -
                leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.z == -1) {
              parameters.pickedMesh.position.x =
                leftIntersectedMesh.position.x +
                leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == 1) {
              parameters.pickedMesh.position.z =
                leftIntersectedMesh.position.z +
                leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == -1) {
              parameters.pickedMesh.position.z =
                leftIntersectedMesh.position.z -
                leftIntersectedMesh.getBoundingInfo().boundingBox.extendSize.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            }
          }
          // contact with the corner wall from the left edge
          else if (backIntersectedWall && leftIntersectedWall) {
            let rotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              parameters.rotationAmount
            );
            if (rotationVector.z == 1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.x =
                leftIntersectedWall.position.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.z == -1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.x =
                leftIntersectedWall.position.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == 1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.z =
                leftIntersectedWall.position.z -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == -1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.z =
                leftIntersectedWall.position.z +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            }
          }
          // contact with the corner wall from the right edge
          else if (backIntersectedWall && rightInersectedWall) {
            let rotationVector = Tools.rotateVector(
              new BABYLON.Vector3(0, 0, 1),
              parameters.rotationAmount
            );
            if (rotationVector.z == 1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.x =
                rightInersectedWall.position.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.z == -1) {
              parameters.pickedMesh.position.z =
                backIntersectedWall.position.z +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.x =
                rightInersectedWall.position.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == 1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.z =
                rightInersectedWall.position.z +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            } else if (rotationVector.x == -1) {
              parameters.pickedMesh.position.x =
                backIntersectedWall.position.x +
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .z;
              parameters.pickedMesh.position.z =
                rightInersectedWall.position.z -
                parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize
                  .x;
            }
          } else if (rightInersectedWall) {
            parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90);
            parameters.rotationAmount += BABYLON.Tools.ToRadians(90);
          } else if (leftIntersectedWall) {
            parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(-90);
            parameters.rotationAmount += BABYLON.Tools.ToRadians(-90);
          }

          if (
            Tools.calculateDistance(
              parameters.pickedMesh.position,
              origin.position
            ) >
            parameters.meshMultiplier / 2
          ) {
            parameters.pickedMesh.position.x = origin.position.x;
            parameters.pickedMesh.position.z = origin.position.z;
          }

          // conditions for displaying the selected mesh

          parameters.pickedMesh
            .getChildMeshes()
            .filter((child) => child.intersectsMesh(parameters.ground, false))
            .length == parameters.pickedMesh.getChildMeshes().length
            ? (parameters.showPickedMesh = true)
            : (parameters.showPickedMesh = true);
          if (parameters.showPickedMesh) {
            parameters.pickedMesh.material.alpha = 0.5;
            parameters.pickedMesh.getChildMeshes().map((child) => {
              if (child.name != "inner") {
                child.material.alpha = 0.5;
              }
            });
            // parameters.pickedMesh.isPickable = true
          } else {
            parameters.pickedMesh.material.alpha = 0.0;
            parameters.pickedMesh
              .getChildMeshes()
              .map((child) => (child.material.alpha = 0.0));
            // parameters.pickedMesh.isPickable = false
          }

          // conditions for the selected mesh to be coloured red
          parameters.paintPickedMesh = false;

          parameters.placedMeshes.map((obj) =>
            backCollider.intersectsMesh(obj, false)
              ? (parameters.paintPickedMesh = true)
              : ""
          );

          //contact with wall
          parameters.paintPickedMesh =
            parameters.walls.filter((wall) =>
              backCollider.intersectsMesh(wall, false)
            ).length == 0 && !parameters.pickedMesh.allowNoWall;

          //nesting
          if (collision) parameters.paintPickedMesh = true;

          if (parameters.paintPickedMesh) {
            parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(
              1,
              0,
              0
            );
          } else {
            parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(
              0,
              0,
              0
            );
          }
        }
      }
    });

    parameters.scene.actionManager = new BABYLON.ActionManager(
      parameters.scene
    );

    // stage right and left click operations
    parameters.scene.onPointerObservable.add((pointerInfo) => {
      if (parameters.pickedMesh && !parameters.pickedMesh.isDisposed()) {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERTAP:
            if (pointerInfo.event.button == 0) {
              // left click
              Tools.putMesh();
            } else if (pointerInfo.event.button == 2) {
              // right click
              parameters.pickedMesh.rotation.y += BABYLON.Tools.ToRadians(90);
              parameters.rotationAmount += BABYLON.Tools.ToRadians(90);
            }

            break;
          case BABYLON.PointerEventTypes.POINTERMOVE:
            let pickResult = parameters.scene.pick(
              parameters.scene.pointerX,
              parameters.scene.pointerY
            );
            if (pickResult.hit) {
              let mousePosition = new BABYLON.Vector3(
                pickResult.pickedPoint.x,
                parameters.originHeight,
                pickResult.pickedPoint.z
              );
              origin.position = mousePosition;
            }

            break;
        }
      }
    });

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

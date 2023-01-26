import * as BABYLON from "babylonjs";
import { MeshGenerator } from "./meshGenerator";
import { parameters } from "./parameters";

export class Tools {
  static createMeshFromMeshInfo = function (meshInfo, scene) {
    var mesh = new BABYLON.MeshBuilder.CreateBox(
      "box",
      {
        depth: meshInfo.size.depth,
        height: meshInfo.size.height,
        width: meshInfo.size.width,
      },
      scene
    );
    mesh.material = new BABYLON.StandardMaterial("", scene);
    mesh.material.diffuseColor = new BABYLON.Color3(
      meshInfo.material.diffuseColor.r,
      meshInfo.material.diffuseColor.g,
      meshInfo.material.diffuseColor.b
    );
    mesh.material.emissiveColor = new BABYLON.Color3(
      meshInfo.material.emissiveColor.r,
      meshInfo.material.emissiveColor.g,
      meshInfo.material.emissiveColor.b
    );
    mesh.position.x = meshInfo.position.x;
    mesh.position.y = meshInfo.position.y;
    mesh.position.z = meshInfo.position.z;

    mesh.rotation.x = meshInfo.rotation.x;
    mesh.rotation.y = meshInfo.rotation.y;
    mesh.rotation.z = meshInfo.rotation.z;
    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnRightPickTrigger,
        function () {
          mesh.dispose();
          var index = parameters.placedMeshes.indexOf(mesh);
          parameters.placedMeshes.splice(index, 1);
          // socket.emit('delete mesh', index)
        }
      )
    );
    return mesh;
  };

  static rotateVector(vect, angle) {
    let matr = new BABYLON.Matrix();
    let quat = new BABYLON.Quaternion.RotationAxis(
      new BABYLON.Vector3(0, 1, 0),
      angle
    );
    quat.toRotationMatrix(matr);
    let rotatedvect = BABYLON.Vector3.TransformCoordinates(vect, matr);
    return rotatedvect;
  }

  static calculateDistance(vect1, vect2) {
    return Math.abs(
      Math.sqrt(Math.pow(vect1.x, 2) + Math.pow(vect1.z, 2)) -
        Math.sqrt(Math.pow(vect2.x, 2) + Math.pow(vect2.z, 2))
    );
  }

  static pickFromMenu = function (mesh) {
    // object type selection
    let boxSize = new BABYLON.Vector3(
      mesh.getBoundingInfo().boundingBox.extendSize.x * 2,
      mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
      mesh.getBoundingInfo().boundingBox.extendSize.z * 2
    );

    if (
      parameters.pickedMesh.material.emissiveColor.equals(
        new BABYLON.Color3(0, 0, 0)
      )
    ) {
      if (!parameters.pickedMesh.isDisposed()) {
        parameters.pickedMesh.dispose();
      }
      parameters.pickedMesh = new BABYLON.MeshBuilder.CreateBox(
        mesh.name,
        { width: boxSize.x, height: boxSize.y, depth: boxSize.z },
        parameters.scene
      );
      // parameters.pickedMesh.position = new BABYLON.Vector3(-1000, -1000, -1000)
      parameters.pickedMesh.position.x = mesh.position.x;
      parameters.pickedMesh.position.z = mesh.position.z;
      parameters.paintPickedMesh = true;
      let material = new BABYLON.StandardMaterial("", parameters.scene);
      material.diffuseColor = mesh.material.diffuseColor;
      // material.emissiveColor = mesh.material.emissiveColor
      parameters.pickedMesh.material = material;
      parameters.pickedMesh.material.alpha = 0.5;
      parameters.pickedMesh.position.y = boxSize.y / 2;
      let product = parameters.products.filter(
        (product) => product.mesh.name == parameters.pickedMesh.name
      )[0];
      if (product.allowNoGround) {
        parameters.pickedMesh.position.y += product.height;
        parameters.pickedMesh.allowNoGround = product.allowNoGround;
      }

      parameters.pickedMesh.actionManager = new BABYLON.ActionManager(
        parameters.scene
      );
      parameters.pickedMesh.isPickable = false;
      parameters.pickedMesh.allowNoWall = product.allowNoWall;
      parameters.isMeshPicked = true;
      parameters.camera.upperBetaLimit = Math.PI / 3;
      parameters.camera.lowerRadiusLimit = parameters.wallSize * 5;

      let right = new BABYLON.MeshBuilder.CreateBox("right", {
        height:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
        depth:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z *
          1.5,
        width: parameters.meshMultiplier / 2,
      });

      right.material = new BABYLON.StandardMaterial(
        "rightMaterial",
        parameters.scene
      );
      right.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      right.setParent(parameters.pickedMesh);
      right.position = new BABYLON.Vector3.Zero();
      right.position.x +=
        parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x +
        right.getBoundingInfo().boundingBox.extendSize.x;
      right.isPickable = false;

      let left = new BABYLON.MeshBuilder.CreateBox("left", {
        height:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
        depth:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z *
          1.5,
        width: parameters.meshMultiplier / 2,
      });

      left.material = new BABYLON.StandardMaterial(
        "leftMaterial",
        parameters.scene
      );
      left.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      left.setParent(parameters.pickedMesh);
      left.position = new BABYLON.Vector3.Zero();
      left.position.x -=
        parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x +
        right.getBoundingInfo().boundingBox.extendSize.x;
      left.isPickable = false;

      let back = new BABYLON.MeshBuilder.CreateBox("back", {
        height:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.y * 2,
        depth: parameters.meshMultiplier / 2,
        width:
          parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x *
          1.5,
      });

      back.material = new BABYLON.StandardMaterial(
        "backMaterial",
        parameters.scene
      );
      back.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
      back.setParent(parameters.pickedMesh);
      back.position = new BABYLON.Vector3.Zero();
      back.position.z +=
        parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z +
        back.getBoundingInfo().boundingBox.extendSize.z;
      back.isPickable = false;

      let innnerCollider = MeshGenerator.createInnerCollider(
        parameters.pickedMesh,
        parameters.scene
      );

      right.material.wireframe = true;
      left.material.wireframe = true;
      back.material.wireframe = true;

      right.material.alpha = 1.0;
      left.material.alpha = 1.0;
      back.material.alpha = 1.0;
    } else if (
      parameters.pickedMesh.material.diffuseColor.equals(
        mesh.material.diffuseColor
      )
    ) {
      parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(
        0,
        0,
        0
      );
      parameters.pickedMesh.dispose();
      parameters.isMeshPicked = false;
    }
  };

  static putMesh = function () {
    if (!parameters.pickedMesh.allowNoGround)
      parameters.pickedMesh
        .getChildMeshes()
        .filter((child) => child.intersectsMesh(parameters.ground, false))
        .length ==
      parameters.pickedMesh.getChildMeshes().length - 1
        ? (parameters.showPickedMesh = true)
        : (parameters.showPickedMesh = false);
    else parameters.showPickedMesh = true;
    console.log(parameters.showPickedMesh);
    if (!parameters.paintPickedMesh && parameters.showPickedMesh) {
      let mesh = new BABYLON.MeshBuilder.CreateBox(
        parameters.pickedMesh.name,
        {
          width:
            parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.x *
            2,
          height:
            parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.y *
            2,
          depth:
            parameters.pickedMesh.getBoundingInfo().boundingBox.extendSize.z *
            2,
        },
        parameters.scene
      );
      let front = new BABYLON.MeshBuilder.CreateBox(
        "front",
        {
          width: mesh.getBoundingInfo().boundingBox.extendSize.x * 1.9,
          height: mesh.getBoundingInfo().boundingBox.extendSize.y * 2,
          depth: mesh.getBoundingInfo().boundingBox.extendSize.z,
        },
        parameters.scene
      );

      front.isPickable = false;
      front.setParent(mesh), (front.parent = mesh);
      mesh.addChild(front);
      front.position = new BABYLON.Vector3.Zero();
      front.position.z -=
        mesh.getBoundingInfo().boundingBox.extendSize.z +
        front.getBoundingInfo().boundingBox.extendSize.z +
        0.1;
      // front.rotation.y=parameters.rotationAmount

      front.material = new BABYLON.StandardMaterial("front", parameters.scene);
      front.material.diffuseColor = new BABYLON.Color3(
        66 / 255,
        135 / 255,
        245 / 255
      );
      front.material.wireframe = true;
      front.material.alpha = 1.0;

      mesh.rotation.y = parameters.rotationAmount;

      let material = new BABYLON.StandardMaterial("", parameters.scene);

      material.emissiveColor = parameters.pickedMesh.material.emissiveColor;
      material.diffuseColor = parameters.pickedMesh.material.diffuseColor;
      material.specularColor = new BABYLON.Color3.Black();
      mesh.material = material;

      mesh.position.x = parameters.pickedMesh.position.x;
      mesh.position.y = parameters.pickedMesh.position.y;
      mesh.position.z = parameters.pickedMesh.position.z;

      parameters.rotationAmount = 0;

      parameters.placedMeshes.push(mesh);

      mesh.actionManager =
        mesh.actionManager == null
          ? new BABYLON.ActionManager(parameters.scene)
          : mesh.actionManager;
      // Displaying the object properties in the menu when left-clicking on it
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnLeftPickTrigger,
          function () {
            if (!parameters.pickedMesh || parameters.pickedMesh.isDisposed()) {
              parameters.highlightedMesh = mesh;
              parameters.highlightedMesh.actionManager =
                parameters.highlightedMesh.actionManager == null
                  ? new BABYLON.ActionManager(parameters.scene)
                  : parameters.highlightedMesh.actionManager;
              // Move by right click
              parameters.highlightedMesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                  BABYLON.ActionManager.OnRightPickTrigger,
                  () => {
                    if (parameters.highlightedMesh) {
                      parameters.placedMeshes = parameters.placedMeshes.filter(
                        (obj) => obj != parameters.highlightedMesh
                      );
                      Tools.pickFromMenu(parameters.highlightedMesh);
                      parameters.highlightedMesh.dispose();
                      parameters.highlightedMesh = null;
                      parameters.gui.contentPanel.width = "0px";
                    }
                  }
                )
              );
              parameters.gui.contentPanel.width = "350px";
              parameters.gui.createProductInfoMenu(parameters.highlightedMesh);
            }
          }
        )
      );

      parameters.pickedMesh.material.alpha = 0;
      parameters.isMeshPicked = false;
      parameters.pickedMesh.material.emissiveColor = new BABYLON.Color3(
        0,
        0,
        0
      );
      parameters.pickedMesh.dispose();

      front.alpha = 0.0;

      parameters.camera.upperBetaLimit = Math.PI / 2.15;
      parameters.camera.lowerRadiusLimit = parameters.wallSize * 2;
    }
  };
}

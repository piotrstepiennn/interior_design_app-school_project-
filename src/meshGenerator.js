import * as BABYLON from "babylonjs";
import { parameters } from "./parameters";

export class VertexBody {
  constructor(mesh) {
    this.VECTOR = {
      X: 0,
      Y: 1,
      Z: 2,
    };

    this.vertexData = new BABYLON.VertexData();
    this.vertexData.positions = mesh.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    this.vertexData.normals = mesh.getVerticesData(
      BABYLON.VertexBuffer.NormalKind
    );
    this.vertexData.uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
    this.vertexData.indices = mesh.getIndices(); // [2,3,1,5,-3]
    this.meshSize = mesh.getBoundingInfo().boundingBox.extendSize;

    this.getVertexData = function () {
      return this.vertexData;
    };

    this.isZeroOrigin = function (vector) {
      var negativeNumberFlag = false;
      for (
        let i = 0;
        i < Math.floor(this.vertexData.positions.length / 3);
        i++
      ) {
        if (this.vertexData.positions[3 * i + vector] < 0) {
          negativeNumberFlag = true;
        }
      }
      return negativeNumberFlag;
    };

    this.scaleX = function (amount) {
      this.scale(amount, this.VECTOR.X);
    };

    this.scaleY = function (amount) {
      this.scale(amount, this.VECTOR.Y);
    };

    this.scaleZ = function (amount) {
      this.scale(amount, this.VECTOR.Z);
    };

    this.getMeshSizeByVector = function (vector) {
      var meshSize;
      switch (vector) {
        case this.VECTOR.X:
          meshSize = this.meshSize.x;
          break;
        case this.VECTOR.Y:
          meshSize = this.meshSize.y;
          break;
        case this.VECTOR.Z:
          meshSize = this.meshSize.z;
          break;
      }
      return meshSize;
    };

    this.scale = function (amount, vector) {
      var originPoint;
      this.isZeroOrigin(vector)
        ? (originPoint = 0)
        : (originPoint = this.getMeshSizeByVector(vector));
      for (
        let i = 0;
        i < Math.floor(this.vertexData.positions.length / 3);
        i++
      ) {
        if (this.vertexData.positions[3 * i + vector] < originPoint) {
          this.vertexData.positions[3 * i + vector] -= amount;
        } else if (this.vertexData.positions[3 * i + vector] > originPoint) {
          this.vertexData.positions[3 * i + vector] += amount;
        }
      }
    };
    this.move = function (vertices, amount, vector) {
      vertices.map((vertexIndex) => {
        this.vertexData.positions[3 * vertexIndex + vector] += amount;
      });
    };
    this.moveX = function (vertices, amount) {
      this.move(vertices, amount, this.VECTOR.X);
    };
    this.moveY = function (vertices, amount) {
      this.move(vertices, amount, this.VECTOR.Y);
    };
    this.moveZ = function (vertices, amount) {
      this.move(vertices, amount, this.VECTOR.Z);
    };

    this.createMeshFromVertexData = function (name, scene) {
      var mesh = new BABYLON.Mesh(name, scene);
      this.vertexData.applyToMesh(mesh, true);
      return mesh;
    };
  }
}

export class MeshGenerator {
  static coverTypes = {
    singleLeft: "singleLeft",
    singleRight: "singleRight",
    doubleCover: "doubleCover",
    fromTop: "fromTop",
  };

  static bottomCupboard = {
    drawer: "drawer",
    bottomCabinet: "bottomCabinet",
    upperCabinet: "upperCabinet",
  };

  //Params
  static debuggingAlpha = 0.0;

  static generateMesh = function (
    params = {
      // Object
      objName, // String
      objWidth, // Number
      objSize, // Number
      depth, // Number
      density, // String
      textureURL, // String
      cabinetType, // String || Enum
      cover,
      shelves, //
      furnitureBottom,
      structure,
      handle,
    },
    scene // BABYLON.Scene
  ) {
    //centre point
    var root = BABYLON.Mesh.CreateSphere(params.objName, 4, 0.1, scene);
    root.material = new BABYLON.StandardMaterial("rootMat", scene);

    //creating main surfaces
    var body = BABYLON.Mesh.CreateSphere("body", 4, 0.1, scene);
    body.material = new BABYLON.StandardMaterial("bodyMat", scene);
    var top = new BABYLON.MeshBuilder.CreateBox(
      "top",
      {
        width: params.objWidth,
        height: params.density,
        depth: params.depth,
      },
      scene
    );
    var bottom = new BABYLON.MeshBuilder.CreateBox(
      "bottom",
      {
        width: params.objWidth,
        height: params.density,
        depth: params.depth,
      },
      scene
    );
    var left = new BABYLON.MeshBuilder.CreateBox(
      "left",
      {
        width: params.density,
        height: params.objSize,
        depth: params.depth,
      },
      scene
    );
    var right = new BABYLON.MeshBuilder.CreateBox(
      "right",
      {
        width: params.density,
        height: params.objSize,
        depth: params.depth,
      },
      scene
    );

    var arka = new BABYLON.MeshBuilder.CreateBox(
      "arka",
      { width: params.objWidth, height: params.objSize, depth: params.density },
      scene
    );

    // Parent-Child operations
    body.setParent(root);
    top.setParent(body);
    bottom.setParent(body);
    left.setParent(body);
    right.setParent(body);
    arka.setParent(body);

    top.position = new BABYLON.Vector3(
      0,
      params.objSize - params.density / 2,
      0
    );
    bottom.position = new BABYLON.Vector3(0, params.density / 2, 0);
    left.position = new BABYLON.Vector3(
      params.objWidth / 2 - params.density / 2,
      params.objSize / 2,
      0
    );
    right.position = new BABYLON.Vector3(
      -params.objWidth / 2 + params.density / 2,
      params.objSize / 2,
      0
    );
    arka.position = new BABYLON.Vector3(
      0,
      params.objSize / 2,
      params.depth / 2 - params.density / 2
    );

    // bottom
    if (params.cabinetType != this.bottomCupboard.upperCabinet) {
      var bottomFurniture = BABYLON.Mesh.CreateSphere(
        "bottomFurniture",
        4,
        0.1,
        scene
      );
      bottomFurniture.material = new BABYLON.StandardMaterial(
        "bottomFurnitureMat",
        scene
      );
      var onLeft = params.furnitureBottom.structure.clone("on left bottom");
      var onRight = params.furnitureBottom.structure.clone("on right bottom");
      var backLeft = params.furnitureBottom.structure.clone(
        "on back left bottom"
      );
      var backRight = params.furnitureBottom.structure.clone(
        "on back right bottom"
      );

      // Parent-Child procedures for bottomFurniture
      bottomFurniture.setParent(root);
      onLeft.setParent(bottomFurniture);
      onRight.setParent(bottomFurniture);
      backLeft.setParent(bottomFurniture);
      backRight.setParent(bottomFurniture);

      // material processing for bottomFurniture
      var ayakMat = new BABYLON.StandardMaterial("ayakMat", scene);
      ayakMat.diffuseColor = new BABYLON.Color3.FromHexString("#ff8284");
      bottomFurniture.getChildMeshes().map((ayak) => {
        ayak.material = ayakMat;
      });

      // bottomFurniture için pozisyon islemleri
      bottomFurniture.position = new BABYLON.Vector3(
        0,
        bottomFurniture.getChildMeshes()[0].getBoundingInfo().boundingBox
          .extendSize.y * 2,
        0
      );
      onLeft.position = new BABYLON.Vector3(
        params.objWidth / 2.25,
        -onLeft.getBoundingInfo().boundingBox.extendSize.y,
        -params.depth / 2.25
      );
      onRight.position = new BABYLON.Vector3(
        -params.objWidth / 2.25,
        -onRight.getBoundingInfo().boundingBox.extendSize.y,
        -params.depth / 2.25
      );
      backLeft.position = new BABYLON.Vector3(
        params.objWidth / 2.25,
        -backLeft.getBoundingInfo().boundingBox.extendSize.y,
        params.depth / 2.25
      );
      backRight.position = new BABYLON.Vector3(
        -params.objWidth / 2.25,
        -backRight.getBoundingInfo().boundingBox.extendSize.y,
        params.depth / 2.25
      );
    }

    // position processing for main surfaces
    if (bottomFurniture) {
      body.position = new BABYLON.Vector3(
        0,
        bottomFurniture.getChildMeshes()[0].getBoundingInfo().boundingBox
          .extendSize.y * 2,
        0
      );
    } else {
      body.position = new BABYLON.Vector3.Zero();
    }

    // caps
    if (params.cover) {
      switch (params.cover.tip) {
        case this.coverTypes.doubleCover:
          // hinges
          var hingesMat = new BABYLON.StandardMaterial("hingesMat", scene);
          var hingesLeft = BABYLON.Mesh.CreateSphere(
            "hingesLeft",
            4,
            0.1,
            scene
          );
          hingesLeft.material = hingesMat;
          hingesLeft.setParent(body);
          hingesLeft.position = new BABYLON.Vector3(
            params.objWidth / 2 - params.density / 2,
            params.objSize / 2,
            -(params.depth / 2 + params.density / 2)
          );
          var hingesRight = BABYLON.Mesh.CreateSphere(
            "hingesLeft",
            4,
            0.1,
            scene
          );
          hingesRight.material = hingesMat;
          hingesRight.setParent(body);
          hingesRight.position = new BABYLON.Vector3(
            -(params.objWidth / 2 - params.density / 2),
            params.objSize / 2,
            -(params.depth / 2 + params.density / 2)
          );

          // right cover
          var rightCover = new BABYLON.MeshBuilder.CreateBox(
            "rightCover",
            {
              width: params.objWidth / 2,
              height: params.objSize + 0.0001,
              depth: params.cover.density,
            },
            scene
          );
          rightCover.setParent(hingesRight);
          rightCover.position = new BABYLON.Vector3(
            params.objWidth / 4 - params.density / 2,
            0,
            0
          );
          rightCover.scaling.x = 0.99;
          rightCover.material = new BABYLON.StandardMaterial("coverMat", scene);
          rightCover.material.diffuseColor = new BABYLON.Color3.FromHexString(
            "#2c4163"
          );

          // left cover
          var leftCover = new BABYLON.MeshBuilder.CreateBox(
            "leftCover",
            {
              width: params.objWidth / 2,
              height: params.objSize + 0.0001,
              depth: params.cover.density,
            },
            scene
          );
          leftCover.setParent(hingesLeft);
          leftCover.position = new BABYLON.Vector3(
            -(params.objWidth / 4 - params.density / 2),
            0,
            0
          );
          leftCover.scaling.x = 0.99;
          leftCover.material = new BABYLON.StandardMaterial("coverMat", scene);
          leftCover.material.diffuseColor = new BABYLON.Color3.FromHexString(
            "#2c4163"
          );

          // handle right
          var handleRight = params.cover.handle.clone("handleRight");
          handleRight.setParent(rightCover);
          handleRight.position = new BABYLON.Vector3(
            params.objWidth / 5,
            0,
            -(
              params.cover.density / 2 +
              handleRight.getBoundingInfo().boundingBox.extendSize.z
            )
          );
          handleRight.isPickable = false;

          // handle left
          var handleLeft = params.cover.handle.clone("handleLeft");
          handleLeft.setParent(leftCover);
          handleLeft.position = new BABYLON.Vector3(
            -params.objWidth / 5,
            0,
            -(
              params.cover.density / 2 +
              handleLeft.getBoundingInfo().boundingBox.extendSize.z
            )
          );
          handleLeft.isPickable = false;

          //cover Opening Animation
          [rightCover, leftCover].map((cover) => {
            cover.actionManager = new BABYLON.ActionManager(scene);
            cover.actionManager
              .registerAction(
                new BABYLON.InterpolateValueAction(
                  BABYLON.ActionManager.OnLeftPickTrigger,
                  hingesLeft.rotation,
                  "y",
                  BABYLON.Tools.ToRadians(-90),
                  1000
                )
              )
              .then(
                new BABYLON.InterpolateValueAction(
                  BABYLON.ActionManager.OnLeftPickTrigger,
                  hingesLeft.rotation,
                  "y",
                  BABYLON.Tools.ToRadians(0),
                  1000
                )
              );
            cover.actionManager
              .registerAction(
                new BABYLON.InterpolateValueAction(
                  BABYLON.ActionManager.OnLeftPickTrigger,
                  hingesRight.rotation,
                  "y",
                  BABYLON.Tools.ToRadians(90),
                  1000
                )
              )
              .then(
                new BABYLON.InterpolateValueAction(
                  BABYLON.ActionManager.OnLeftPickTrigger,
                  hingesRight.rotation,
                  "y",
                  BABYLON.Tools.ToRadians(0),
                  1000
                )
              );
          });
          break;
        case this.coverTypes.fromTop:
          // hinges
          var hinges = BABYLON.Mesh.CreateSphere("hinges", 4, 0.1, scene);
          hinges.material = new BABYLON.StandardMaterial("hingesMat", scene);
          hinges.setParent(body);
          hinges.position = new BABYLON.Vector3(
            0,
            params.objSize - params.density / 2,
            -(params.depth / 2 + params.density / 2)
          );

          // cover
          var cover = new BABYLON.MeshBuilder.CreateBox(
            "cover",
            {
              width: params.objWidth,
              height: params.objSize + 0.0001,
              depth: params.cover.density,
            },
            scene
          );
          cover.setParent(hinges);
          cover.position = new BABYLON.Vector3(
            0,
            -(params.objSize / 2 - params.density / 2),
            0
          );
          cover.scaling.x = 0.995;
          cover.material = new BABYLON.StandardMaterial("coverMat", scene);
          cover.material.diffuseColor = new BABYLON.Color3.FromHexString(
            "#2c4163"
          );

          // handle
          var handle = params.cover.handle.clone("handle");
          handle.setParent(cover);
          handle.position = new BABYLON.Vector3(
            0,
            -(params.objSize / 2.35),
            -(
              params.cover.density / 2 +
              handle.getBoundingInfo().boundingBox.extendSize.z
            )
          );
          handle.isPickable = false;

          //cover Opening Animation
          cover.actionManager = new BABYLON.ActionManager(scene);
          cover.actionManager
            .registerAction(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "x",
                BABYLON.Tools.ToRadians(90),
                1000
              )
            )
            .then(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "x",
                BABYLON.Tools.ToRadians(0),
                1000
              )
            );

          break;
        case this.coverTypes.singleRight:
          // hinges
          var hinges = BABYLON.Mesh.CreateSphere("hinges", 4, 0.1, scene);
          hinges.material = new BABYLON.StandardMaterial("hingesMat", scene);
          hinges.setParent(body);
          hinges.position = new BABYLON.Vector3(
            -(params.objWidth / 2 - params.density / 2),
            params.objSize / 2,
            -(params.depth / 2 + params.density / 2)
          );
          //cover
          var cover = new BABYLON.MeshBuilder.CreateBox(
            "cover",
            {
              width: params.objWidth,
              height: params.objSize + 0.0001,
              depth: params.cover.density,
            },
            scene
          );
          cover.setParent(hinges);
          cover.position = new BABYLON.Vector3(
            params.objWidth / 2 - params.density / 2,
            0,
            0
          );
          cover.scaling.x = 0.995;
          cover.material = new BABYLON.StandardMaterial("coverMat", scene);
          cover.material.diffuseColor = new BABYLON.Color3.FromHexString(
            "#2c4163"
          );
          // handle
          var handle = params.cover.handle.clone("handle");
          handle.setParent(cover);
          handle.position = new BABYLON.Vector3(
            params.objWidth / 2.35,
            0,
            -(
              params.cover.density / 2 +
              handle.getBoundingInfo().boundingBox.extendSize.z
            )
          );
          handle.isPickable = false;

          //cover Opening Animation
          cover.actionManager = new BABYLON.ActionManager(scene);
          cover.actionManager
            .registerAction(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "y",
                BABYLON.Tools.ToRadians(90),
                1000
              )
            )
            .then(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "y",
                BABYLON.Tools.ToRadians(0),
                1000
              )
            );
          break;
        case this.coverTypes.singleLeft:
          // hinges
          var hinges = BABYLON.Mesh.CreateSphere("hinges", 4, 0.1, scene);
          hinges.material = new BABYLON.StandardMaterial("hingesMat", scene);
          hinges.setParent(body);
          hinges.position = new BABYLON.Vector3(
            params.objWidth / 2 - params.density / 2,
            params.objSize / 2,
            -(params.depth / 2 + params.density / 2)
          );

          //cover
          var cover = new BABYLON.MeshBuilder.CreateBox(
            "cover",
            {
              width: params.objWidth,
              height: params.objSize + 0.0001,
              depth: params.cover.density,
            },
            scene
          );
          cover.setParent(hinges);
          cover.position = new BABYLON.Vector3(
            -(params.objWidth / 2 - params.density / 2),
            0,
            0
          );
          cover.scaling.x = 0.995;
          cover.material = new BABYLON.StandardMaterial("coverMat", scene);
          cover.material.diffuseColor = new BABYLON.Color3.FromHexString(
            "#2c4163"
          );

          // handle
          var handle = params.cover.handle.clone("handle");
          handle.setParent(cover);
          handle.position = new BABYLON.Vector3(
            -params.objWidth / 2.35,
            0,
            -(
              params.cover.density / 2 +
              handle.getBoundingInfo().boundingBox.extendSize.z
            )
          );
          handle.isPickable = false;

          //cover Opening Animation
          cover.actionManager = new BABYLON.ActionManager(scene);
          cover.actionManager
            .registerAction(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "y",
                BABYLON.Tools.ToRadians(-90),
                1000
              )
            )
            .then(
              new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnLeftPickTrigger,
                hinges.rotation,
                "y",
                BABYLON.Tools.ToRadians(0),
                1000
              )
            );
          break;
      }
    }

    // shelves
    if (params.shelves) {
      params.shelves.map((shelfInfo) => {
        // create each shelf
        var shelf = new BABYLON.MeshBuilder.CreateBox(
          "shelf",
          {
            width: shelfInfo.en - 0.0001,
            height: shelfInfo.objSize,
            depth: shelfInfo.depth - 0.0001,
          },
          scene
        );

        // material processing for each shelf
        shelf.material = new BABYLON.StandardMaterial("shelfMat", scene);
        shelf.material.diffuseColor = new BABYLON.Color3.FromHexString(
          "#6b8fd1"
        );

        // Position operations for each shelf
        shelf.setParent(body);
        shelf.position = new BABYLON.Vector3(
          0,
          shelfInfo.height,
          params.depth / 2 - shelfInfo.depth / 2 - params.density
        );
      });
    }

    //Debugging Tools
    root.material.alpha = this.debuggingAlpha;
    if (params.cover) {
      if (hinges) {
        hinges.material.alpha = this.debuggingAlpha;
      } else {
        hingesRight.material.alpha = this.debuggingAlpha;
        hingesLeft.material.alpha = this.debuggingAlpha;
      }
    }
    body.material.alpha = this.debuggingAlpha;
    if (params.cabinetType != this.bottomCupboard.upperCabinet) {
      bottomFurniture.material.alpha = this.debuggingAlpha;
    }

    return root;
  };

  static createInnerCollider = function (mesh, scene) {
    var innerCollider = new BABYLON.MeshBuilder.CreateBox(
      "inner",
      {
        width: mesh.getBoundingInfo().boundingBox.extendSize.x * 1.99,
        height: mesh.getBoundingInfo().boundingBox.extendSize.y * 1.99,
        depth: mesh.getBoundingInfo().boundingBox.extendSize.z * 1.99,
      },
      scene
    );

    innerCollider.material = new BABYLON.StandardMaterial("", scene);
    innerCollider.material.wireframe = true;
    innerCollider.setParent(mesh);
    innerCollider.isPickable = false;
    innerCollider.position = new BABYLON.Vector3.Zero();

    return innerCollider;
  };

  static createTestBox = function (meshName, size, materialInfo) {
    let box = new BABYLON.MeshBuilder.CreateBox(
      meshName,
      {
        height: size.height * parameters.meshMultiplier,
        width: size.width * parameters.meshMultiplier,
        depth: size.depth * parameters.meshMultiplier,
      },
      parameters.scene
    );

    let material = new BABYLON.StandardMaterial(
      materialInfo.name,
      parameters.scene
    );
    material.specularColor = materialInfo.specularColor;
    material.diffuseColor = materialInfo.diffuseColor;
    material.emissiveColor = materialInfo.emissiveColor;
    box.material = material;
    box.actionManager = new BABYLON.ActionManager(parameters.scene);

    return box;
  };

  static createPointer = function () {
    let pointToIntersect = new BABYLON.Vector3(0, -1000, 0);
    let origin = BABYLON.Mesh.CreateSphere("origin", 4, 0.1, parameters.scene);
    origin.position = pointToIntersect;
    let matPlan = new BABYLON.StandardMaterial("matPlan1", parameters.scene);
    matPlan.backFaceCulling = false;
    matPlan.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);
    origin.material = matPlan;
    origin.material.alpha = parameters.originAlpha;
    origin.isPickable = false;
    origin.checkCollisions = true;

    return origin;
  };
}

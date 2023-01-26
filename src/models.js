import * as BABYLON from "babylonjs";
import { MeshGenerator } from "./meshGenerator";
const fs = require("fs");
import path from "path";
//import mesh1 from "../serializedData/test1.json" assert { type: "json" };

export const createProductList = function () {
  // BLUE BOX CONFIG
  let blueBox = MeshGenerator.createTestBox(
    "szafka",
    { height: 1, depth: 1, width: 1 },
    {
      name: "blueMat",
      specularColor: new BABYLON.Color3.Black(),
      diffuseColor: new BABYLON.Color3(0.3, 0.3, 1),
    }
  );
  blueBox.dispose();

  // RED BOX CONFIG
  let redBox = MeshGenerator.createTestBox(
    "testowa gorna szafka",
    { height: 1, depth: 1, width: 2 },
    {
      name: "redMat",
      specularColor: new BABYLON.Color3.Black(),
      diffuseColor: new BABYLON.Color3(1, 0.3, 0.3),
    }
  );
  redBox.dispose();

  // GREEN BOX CONFIG
  let greenBox = MeshGenerator.createTestBox(
    "lodowka",
    { height: 2, depth: 1, width: 1 },
    {
      name: "greenMat",
      specularColor: new BABYLON.Color3.Black(),
      diffuseColor: new BABYLON.Color3(0.2, 1, 0.2),
    }
  );
  greenBox.dispose();

  // PURPLE BOX CONFIG
  let purpleBox = MeshGenerator.createTestBox(
    "szafa",
    { height: 1, depth: 1, width: 1 },
    {
      name: "greenMat",
      specularColor: new BABYLON.Color3.Black(),
      diffuseColor: new BABYLON.Color3.FromHexString("#7b32a8"),
    }
  );
  purpleBox.dispose();

  let products = [
    {
      name: "przykładowa szafka dolna",
      mesh: blueBox,
      tags: ["Szafka Dolna"],
      image: "https://picsum.photos/100",
      allowNoWall: true,
    },
    {
      name: "test szafka dolna",
      mesh: greenBox,
      tags: ["Szafka Dolna"],
      image: "https://picsum.photos/100",
    },
    {
      name: "test afd",
      mesh: redBox,
      tags: ["AGD"],
      image: "https://picsum.photos/100",
    },
    {
      name: "test szafka gorna",
      mesh: purpleBox,
      tags: ["Szafka Górna"],
      image: "https://picsum.photos/100",
      allowNoGround: true,
      height: 2000,
    },
  ];

  return products;
};

function getJsons() {
  let testFolder = "../serializedData/";
  fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
}

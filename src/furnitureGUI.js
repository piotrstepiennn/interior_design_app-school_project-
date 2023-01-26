import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { parameters } from "./parameters.js";
import { SceneBuilder } from "./sceneBuilder";
import { MeshGenerator } from "./meshGenerator";

export class FurnitureGUI {
  constructor() {
    this.createNewFurniture();
  }

  //tworzenie menu glownego
  createNewFurniture = function () {
    let advancedTexture1 =
      GUI.AdvancedDynamicTexture.CreateFullscreenUI("MyUI");
    let rightContainer = new GUI.StackPanel();
    rightContainer.background = "transparent";
    rightContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rightContainer.height = "40%";
    rightContainer.width = "410px";

    let furnitureContentPanel = new GUI.StackPanel("furnitureContentPanel");
    furnitureContentPanel.background = "#e3e3e3";
    furnitureContentPanel.horizontalAlignment =
      GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    furnitureContentPanel.height = "100%";
    furnitureContentPanel.width = "360px";

    advancedTexture1.addControl(rightContainer);
    rightContainer.addControl(furnitureContentPanel);

    function marginBox(height) {
      let rect = new GUI.Rectangle("marginBox");
      rect.height = height;
      rect.width = 1;
      rect.color = "transperent";
      rect.thickness = 0;
      return rect;
    }

    furnitureContentPanel.clearControls();
    createHeader("Stwórz nowy mebel");
    //zawartosc menu
    furnitureContentPanel.addControl(marginBox("10px"));
    let furnitureSettingsBox = new GUI.Rectangle("furnitureSettingsBox");
    furnitureSettingsBox.width = "80%";
    furnitureSettingsBox.height = "340px";
    furnitureSettingsBox.thickness = 2;
    furnitureSettingsBox.color = "white";
    furnitureSettingsBox.cornerRadius = 5;
    furnitureContentPanel.addControl(furnitureSettingsBox);

    let stackFurnitureSettings = new GUI.StackPanel("stackFurnitureSettings");
    furnitureSettingsBox.addControl(stackFurnitureSettings);

    let title = new GUI.TextBlock("roomSettingsTitle", "Wartości mebla");
    title.fontSize = "18px";
    // title.height="20px"
    // title.width = "150px"
    title.color = "black";
    title.resizeToFit = true;
    title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_TOP;
    stackFurnitureSettings.addControl(title);
    stackFurnitureSettings.addControl(marginBox("10px"));

    let stackFurnitureDimensions = new GUI.StackPanel(
      "stackFurnitureDimensions"
    );
    stackFurnitureDimensions.height = "20px";
    stackFurnitureDimensions.isVertical = false;
    stackFurnitureSettings.addControl(stackFurnitureDimensions);
    stackFurnitureSettings.addControl(marginBox("10px"));

    let labelFurnitureDimensions = new GUI.TextBlock(
      "labelFurnitureDimensions",
      "Wymiary:"
    );
    labelFurnitureDimensions.fontSize = "12px";
    labelFurnitureDimensions.color = "black";
    labelFurnitureDimensions.resizeToFit = true;
    stackFurnitureDimensions.addControl(labelFurnitureDimensions);

    let furnitureWidthInput = new GUI.InputText("furnitureWidthInput", 1);
    furnitureWidthInput.width = "40px";
    furnitureWidthInput.height = "18px";
    furnitureWidthInput.color = "white";
    furnitureWidthInput.fontSize = "12px";
    furnitureWidthInput.paddingLeft = "5px";
    furnitureWidthInput.paddingRight = "5px";
    furnitureWidthInput.onFocusSelectAll = true;
    stackFurnitureDimensions.addControl(furnitureWidthInput);

    let furnitureHeightInput = new GUI.InputText("furnitureHeightInput", 1);
    furnitureHeightInput.width = "40px";
    furnitureHeightInput.height = "18px";
    furnitureHeightInput.color = "white";
    furnitureHeightInput.fontSize = "12px";
    furnitureHeightInput.paddingLeft = "5px";
    furnitureHeightInput.paddingRight = "5px";
    furnitureHeightInput.onFocusSelectAll = true;
    stackFurnitureDimensions.addControl(furnitureHeightInput);

    let furnitureDepthInput = new GUI.InputText("furnitureDepthInput", 1);
    furnitureDepthInput.width = "40px";
    furnitureDepthInput.height = "18px";
    furnitureDepthInput.color = "white";
    furnitureDepthInput.fontSize = "12px";
    furnitureDepthInput.paddingLeft = "5px";
    furnitureDepthInput.paddingRight = "5px";
    furnitureDepthInput.onFocusSelectAll = true;
    stackFurnitureDimensions.addControl(furnitureDepthInput);

    let furnitureScheme = new GUI.StackPanel("furnitureScheme");
    furnitureScheme.height = "300px";
    furnitureScheme.isVertical = true;
    stackFurnitureSettings.addControl(furnitureScheme);
    stackFurnitureSettings.addControl(marginBox("10px"));

    let labelFurnitureScheme = new GUI.TextBlock(
      "labelFurnitureScheme",
      "Typ mebla:"
    );
    labelFurnitureScheme.fontSize = "12px";
    labelFurnitureScheme.color = "black";
    labelFurnitureScheme.resizeToFit = true;
    furnitureScheme.addControl(labelFurnitureScheme);

    var addRadio = function (text, parent, furnitureType, isChecked) {
      var button = new GUI.RadioButton();
      button.width = "12px";
      button.height = "12px";
      button.color = "white";
      button.background = "black";
      button.isChecked = isChecked;

      button.onIsCheckedChangedObservable.add(function (state) {
        if (state) {
          console.log(text);
          parameters.selectedCategory = furnitureType;
        }
      });

      var header = GUI.Control.AddHeader(button, text, "80px", {
        isHorizontal: true,
        controlFirst: true,
      });
      header.height = "15px";
      header.width = "100px";
      header.fontSize = "12px";
      header.paddingLeft = "10px";
      header.color = "black";
      parent.addControl(header);
    };

    addRadio("Szafka Dolna", furnitureScheme, ["Szafka Dolna"], true);
    addRadio("Szafka Górna", furnitureScheme, ["Szafka Górna"]);
    addRadio("AGD", furnitureScheme, ["AGD"]);

    let colorPicker = new GUI.ColorPicker();
    colorPicker.isVisible = true;
    colorPicker.width = "150px";
    colorPicker.height = "150px";
    furnitureScheme.addControl(colorPicker);

    //rgb kolor
    let selectedColor = new BABYLON.Color3();
    colorPicker.onValueChangedObservable.add((value) => {
      selectedColor.copyFrom(value);
    });

    let labelFurnitureName = new GUI.TextBlock(
      "labelFurnitureDimensions",
      "Nazwa pliku:"
    );
    labelFurnitureName.fontSize = "12px";
    labelFurnitureName.color = "black";
    labelFurnitureName.resizeToFit = true;
    furnitureScheme.addControl(labelFurnitureName);

    let furnitureNameInput = new GUI.InputText("furnitureNameInput");
    furnitureNameInput.width = "80px";
    furnitureNameInput.height = "18px";
    furnitureNameInput.color = "white";
    furnitureNameInput.fontSize = "12px";
    furnitureNameInput.paddingLeft = "5px";
    furnitureNameInput.paddingRight = "5px";
    furnitureNameInput.onFocusSelectAll = true;
    furnitureScheme.addControl(furnitureNameInput);

    let buttonSaveFurniture = new GUI.Button.CreateSimpleButton(
      "buttonSetFurnitureSize",
      "Zapisz"
    );
    buttonSaveFurniture.width = "65px";
    buttonSaveFurniture.height = "18px";
    buttonSaveFurniture.paddingLeft = "5px";
    buttonSaveFurniture.color = "Black";
    // buttonSaveFurniture.paddingRight = "5px"
    buttonSaveFurniture.fontSize = "12px";
    buttonSaveFurniture.onPointerDownObservable.add(() => {
      console.log("savefurniture");
      // TODO:
      // crate mesh based on user configuration by gui and
      // save it to .json and make it load in products menu as draggable furniture

      let mesh = MeshGenerator.createTestBox(
        furnitureNameInput.text,
        {
          height: furnitureHeightInput.text,
          depth: furnitureDepthInput.text,
          width: furnitureWidthInput.text,
        },
        {
          specularColor: new BABYLON.Color3.Black(),
          diffuseColor: selectedColor,
        }
      );

      var serializedMeshJson = JSON.stringify(
        BABYLON.SceneSerializer.SerializeMesh(mesh)
      );
      mesh.dispose();

      var obj = JSON.parse(serializedMeshJson);
      console.log(obj);
      obj["selectedCategory"] = parameters.selectedCategory;
      var jsonStr = JSON.stringify(obj);
      console.log(jsonStr);
      const blob = new Blob([jsonStr], { type: "octet/stream" });
      // turn blob into an object URL; saved as a member, so can be cleaned out later
      const objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = objectUrl;
      link.download = furnitureNameInput.text + ".json";
      const click = document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      link.dispatchEvent(click);
    });
    furnitureScheme.addControl(buttonSaveFurniture);
    function createHeader(headerName) {
      let header = new GUI.StackPanel("header");
      header.background = "#303030";
      header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      header.height = "60px";

      let headerText = new GUI.TextBlock("headerText", headerName);
      headerText.color = "white";
      headerText.width = "160px";

      let closeButton = new GUI.Button.CreateImageOnlyButton(
        "btn1",
        "./icons/cross.svg"
      );
      closeButton.width = "16px";
      closeButton.height = "20px";
      closeButton.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_BOTTOM;
      closeButton.horizontalAlignment = GUI.Control._HORIZONTAL_ALIGNMENT_RIGHT;
      closeButton.color = "transparent";

      closeButton.onPointerDownObservable.add(() => {
        furnitureContentPanel.width = "0px";
      });
      header.addControl(headerText);
      header.addControl(closeButton);
      furnitureContentPanel.addControl(header);
    }
  };
}

import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { parameters } from "./parameters.js";
import { SceneBuilder } from "./sceneBuilder";

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

    let groundWidthInput = new GUI.InputText(
      "groundWidthInput",
      parameters.groundWidth / 1000
    );
    groundWidthInput.width = "40px";
    groundWidthInput.height = "18px";
    groundWidthInput.color = "white";
    groundWidthInput.fontSize = "12px";
    groundWidthInput.paddingLeft = "5px";
    groundWidthInput.paddingRight = "5px";
    groundWidthInput.onFocusSelectAll = true;
    stackFurnitureDimensions.addControl(groundWidthInput);

    let groundHeigthInput = new GUI.InputText(
      "groundHeigthInput",
      parameters.groundHeigth / 1000
    );
    groundHeigthInput.width = "40px";
    groundHeigthInput.height = "18px";
    groundHeigthInput.color = "white";
    groundHeigthInput.fontSize = "12px";
    groundHeigthInput.paddingLeft = "5px";
    groundHeigthInput.paddingRight = "5px";
    groundHeigthInput.onFocusSelectAll = true;
    stackFurnitureDimensions.addControl(groundHeigthInput);

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
          parameters.categories = furnitureType;
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

    let buttonSetRoom = new GUI.Button.CreateSimpleButton(
      "buttonSetFurnitureSize",
      "Zapisz"
    );
    buttonSetRoom.width = "65px";
    buttonSetRoom.height = "18px";
    buttonSetRoom.paddingLeft = "5px";
    buttonSetRoom.color = "Black";
    // buttonSetRoom.paddingRight = "5px"
    buttonSetRoom.fontSize = "12px";
    buttonSetRoom.onPointerDownObservable.add(() => {
      // TODO:
      // crate mesh based on user configuration by gui and
      // save it to .json and make it load in products menu as draggable furniture
    });
    furnitureScheme.addControl(buttonSetRoom);
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

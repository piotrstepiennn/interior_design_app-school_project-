import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { parameters } from "./parameters.js";
import { SceneBuilder } from "./sceneBuilder";
import { Tools } from "./tools";

export class RoomDesignGUI {
  constructor() {
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.leftContainer = new GUI.StackPanel();
    this.leftContainer.background = "transparent";
    this.leftContainer.horizontalAlignment =
      GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.leftContainer.height = "100%";
    this.leftContainer.width = "410px";

    //menu główne
    this.panelButtons = [];
    this.panel = new GUI.StackPanel();
    this.panel.background = "#33334C";
    this.panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.panel.height = "100%";
    this.panel.width = "60px";

    this.contentPanel = new GUI.StackPanel("contentPanel");
    this.contentPanel.background = "#e3e3e3";
    this.contentPanel.horizontalAlignment =
      GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.contentPanel.height = "100%";
    this.contentPanel.width = "0px";

    // przyciski
    this.mainMenuButton = new GUI.Button.CreateSimpleButton("Menu Główne", "G");
    this.mainMenuButton.height = "60px";
    this.mainMenuButton.color = "white";
    this.mainMenuButton.thickness = 0;
    this.mainMenuButton.background = "#33334C";
    this.panelButtons.push(this.mainMenuButton);
    this.mainMenuButton.onPointerDownObservable.add(() => {
      this.createMainMenu();
    });

    //menu - produkty
    this.productButton = new GUI.Button.CreateSimpleButton("Produkty", "P");
    this.productButton.height = "60px";
    this.productButton.color = "white";
    this.productButton.thickness = 0;
    this.panelButtons.push(this.productButton);
    this.productButton.onPointerDownObservable.add(() => {
      this.createProductMenu();
    });

    //menu - informacje
    this.infoButton = new GUI.Button.CreateSimpleButton("Informacje", "Info");
    this.infoButton.height = "60px";
    this.infoButton.color = "white";
    this.infoButton.thickness = 0;
    this.panelButtons.push(this.infoButton);
    this.infoButton.onPointerDownObservable.add(() => {
      this.createProductInfoMenu(parameters.highlightedMesh);
    });

    // zmiana widoku sceny 2D/3D
    this.viewButton = new GUI.Button.CreateSimpleButton("Widok", "2D/3D");
    this.viewButton.height = "60px";
    this.viewButton.color = "white";
    this.viewButton.thickness = 0;
    this.panelButtons.push(this.viewButton);
    this.viewButton.onPointerDownObservable.add(() => {
      this.changeCameraMode();
    });

    // common function for buttons
    this.panelButtons.map((button) => {
      button.onPointerDownObservable.add(() => {
        this.panelButtons.map((btn) => (btn.background = "#33334C"));
        if (button != this.viewButton) {
          button.background = "#222233";
          this.contentPanel.width = "350px";
        }
      });
    });

    // dodanie przyciskow do interfejsu uzytkownika
    this.panel.addControl(this.mainMenuButton);
    this.panel.addControl(this.productButton);
    this.panel.addControl(this.infoButton);
    this.panel.addControl(this.viewButton);
    this.advancedTexture.addControl(this.leftContainer);
    this.leftContainer.addControl(this.panel);
    this.leftContainer.addControl(this.contentPanel);

    this.marginBox = (height) => {
      let rect = new GUI.Rectangle("marginBox");
      rect.height = height;
      rect.width = 1;
      rect.color = "transperent";
      rect.thickness = 0;
      return rect;
    };

    this.changeCameraMode = () => {
      if (this.viewButton.children[0].text == "2D") {
        // rzut prostokątny
        parameters.camera.position = new BABYLON.Vector3(
          0,
          parameters.groundHeigth * 2,
          0
        );
        parameters.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        // let distance = parameters.groundWidth * 2;
        let distance =
          parameters.groundWidth > parameters.groundHeigth
            ? parameters.groundWidth * 2
            : parameters.groundHeigth * 2;
        let aspect =
          parameters.scene.getEngine().getRenderingCanvasClientRect().height /
          parameters.scene.getEngine().getRenderingCanvasClientRect().width;
        parameters.camera.orthoLeft = distance / 2;
        parameters.camera.orthoRight = -distance / 2;
        parameters.camera.orthoBottom = parameters.camera.orthoLeft * aspect;
        parameters.camera.orthoTop = parameters.camera.orthoRight * aspect;
        parameters.camera.detachControl(parameters.canvas);
        this.viewButton.children[0].text = "3D";
      } else {
        // poprzedni rzut
        parameters.camera.attachControl(parameters.canvas, true);
        parameters.camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        parameters.camera.alpha = -Math.PI / 2;
        this.viewButton.children[0].text = "2D";
      }
      this.contentPanel.width = "0px";
    };

    // tworzenie listy produktow - obiektow
    this.buildProductList = (selectedProducts, productList, returnText) => {
      productList.clearControls();
      let returnButton = new GUI.Button.CreateSimpleButton(
        "returnButton",
        returnText + "  <"
      );
      returnButton.width = 1;
      returnButton.height = "40px";
      returnButton.onPointerDownObservable.add(() => {
        this.createProductMenu();
      });
      productList.addControl(returnButton);
      selectedProducts.map((selectedProduct) => {
        let productBox = new GUI.Rectangle(selectedProduct.name);
        productBox.paddingLeft = "10px";
        productBox.paddingRight = "10px";
        productBox.paddingTop = "10px";
        productBox.width = 1;
        productBox.height = "100px";
        productBox.thickness = 2;
        productBox.color = "white";

        let productImage = new GUI.Button.CreateImageOnlyButton(
          selectedProduct.name + "Image",
          selectedProduct.image
        );
        productImage.height = "100px";
        productImage.width = "100px";
        productImage.thickness = 0;
        // productImage.paddingLeft="10px"
        // productImage.paddingTop="10px"
        // productImage.paddingBottom="10px"
        productImage.horizontalAlignment =
          GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        productImage.onPointerDownObservable.add(() => {
          Tools.pickFromMenu(selectedProduct.mesh);
          this.contentPanel.width = 0;
          this.panelButtons.map((btn) => (btn.background = "#33334C"));
        });

        let productContent = new GUI.Rectangle(
          selectedProduct.name + "Content"
        );
        productContent.height = "100%";
        productContent.width = "225px";
        productContent.horizontalAlignment =
          GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

        let productTitle = new GUI.TextBlock(
          selectedProduct.name,
          selectedProduct.name
        );
        productTitle.height = "20px";
        productTitle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        productContent.addControl(productTitle);

        productBox.addControl(productImage);
        productBox.addControl(productContent);
        productList.addControl(productBox);
      });
    };

    this.createHeader = (headerName) => {
      let header = new GUI.StackPanel("header");
      header.background = "#303030";
      header.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      header.height = "60px";

      let headerText = new GUI.TextBlock("headerText", headerName);
      headerText.color = "white";
      headerText.width = "150px";

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
        this.contentPanel.width = "0px";
        this.panelButtons.map((btn) => (btn.background = "#33334C"));
        if (parameters.highlightedMesh) {
          parameters.highlightedMesh.material.emissiveColor =
            new BABYLON.Color3.Black();
          parameters.highlightedMesh = null;
        }
      });
      header.addControl(headerText);
      header.addControl(closeButton);
      this.contentPanel.addControl(header);
    };

    // menu glowne dla produktow = obiektow
    this.createProductMenu = () => {
      console.log(parameters.pickedMesh);
      this.contentPanel.clearControls();
      this.createHeader("Produkty");
      // zawartość menu

      function marginBox(height) {
        let rect = new GUI.Rectangle("marginBox");
        rect.height = height;
        rect.width = 1;
        rect.color = "transperent";
        rect.thickness = 0;
        return rect;
      }

      this.contentPanel.addControl(marginBox("10px"));
      let rect = new GUI.Rectangle("rect1");
      rect.width = "80%";
      rect.height = "40px";
      rect.thickness = 2;
      rect.color = "white";
      rect.cornerRadius = 10;
      this.contentPanel.addControl(rect);

      let searchInput = new GUI.InputText("search");
      searchInput.width = 1;
      searchInput.thickness = 0;
      searchInput.height = "100%";
      searchInput.color = "white";
      searchInput.onTextChangedObservable.add(() => {
        if (searchInput.text == "") {
          productList.clearControls();
          parameters.categories.map((category) => {
            let button = new GUI.Button.CreateSimpleButton(category, category);
            button.width = "100%";
            button.height = "40px";
            button.onPointerDownObservable.add(() => {
              let selectedProduct = [];
              parameters.products.map((product) => {
                if (
                  product.tags.filter((tag) => tag == button.name).length > 0
                ) {
                  selectedProduct.push(product);
                }
              });
              this.buildProductList(selectedProduct, productList, button.name);
            });
            productList.addControl(button);
          });
        } else {
          let selectedProduct = [];
          parameters.products.map((product) => {
            if (
              product.name
                .toLowerCase()
                .search(searchInput.text.toLowerCase()) != -1 ||
              product.tags.filter(
                (tag) =>
                  tag.toLowerCase().search(searchInput.text.toLowerCase()) != -1
              ).length > 0
            ) {
              selectedProduct.push(product);
            }
          });
          this.buildProductList(
            selectedProduct,
            productList,
            "Wyniki wyszukiwania"
          );
        }
      });

      rect.addControl(searchInput);

      this.contentPanel.addControl(marginBox("10px"));

      let productList = new GUI.StackPanel("productList");
      productList.width = "100%";
      this.contentPanel.addControl(productList);

      parameters.categories.map((category) => {
        let button = new GUI.Button.CreateSimpleButton(category, category);
        button.width = 1;
        button.height = "40px";
        button.onPointerDownObservable.add(() => {
          let selectedProduct = [];
          parameters.products.map((product) => {
            if (product.tags.filter((tag) => tag == button.name).length > 0) {
              selectedProduct.push(product);
            }
          });
          this.buildProductList(selectedProduct, productList, button.name);
        });
        productList.addControl(button);
      });
    };
    // szczególy produktu
    this.createProductInfoMenu = () => {
      this.contentPanel.clearControls();

      // sekcja headera
      this.createHeader("Szczegóły produktu");

      // zawartosc szczegolow
      let infoStack = new GUI.StackPanel("info");
      infoStack.width = "100%";
      // infoStack.top=-0.17
      infoStack.height = "100%";
      this.contentPanel.addControl(infoStack);

      if (!parameters.highlightedMesh) {
        let textMessage = new GUI.TextBlock(
          "text",
          "Wybierz produkt aby wyświetlić szczegóły."
        );
        textMessage.color = "#474747";
        textMessage.width = 1;

        infoStack.addControl(textMessage);
      } else {
        let productDetailBox = new GUI.StackPanel("Szczegóły");
        productDetailBox.width = "100%";
        productDetailBox.height = "200px";
        productDetailBox.paddingLeft = "10px";
        productDetailBox.paddingRight = "10px";
        productDetailBox.paddingTop = "10px";
        infoStack.addControl(productDetailBox);

        let titleBox = new GUI.Rectangle("titleBox");
        titleBox.height = "30px";
        titleBox.width = 1;
        titleBox.paddingBottom = "10px";
        titleBox.thickness = 0;
        productDetailBox.addControl(titleBox);

        // Button Box
        let box = new GUI.Rectangle();
        box.height = "30px";
        box.width = "90px";
        box.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        titleBox.addControl(box);
        box.thickness = 0;

        //przenoszenie via interface
        let move = new GUI.Button.CreateSimpleButton("move", "M");
        move.height = "30px";
        move.width = "30px";
        move.color = "black";
        move.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        move.onPointerDownObservable.add(() => {
          parameters.placedMeshes = parameters.placedMeshes.filter(
            (obj) => obj != parameters.highlightedMesh
          );
          Tools.pickFromMenu(parameters.highlightedMesh);
          parameters.highlightedMesh.dispose();
          parameters.highlightedMesh = null;
          this.contentPanel.width = "0px";
        });
        box.addControl(move);

        //kopiowanie
        let copy = new GUI.Button.CreateSimpleButton("copy", "C");
        copy.height = "30px";
        copy.width = "30px";
        copy.color = "black";
        copy.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        copy.onPointerDownObservable.add(() => {
          Tools.pickFromMenu(parameters.highlightedMesh);
          parameters.highlightedMesh.material.emissiveColor =
            new BABYLON.Color3.Black();
          parameters.highlightedMesh = null;
          this.contentPanel.width = "0px";
        });
        box.addControl(copy);

        //Usuwanie
        let del = new GUI.Button.CreateSimpleButton("delete", "X");
        del.height = "30px";
        del.width = "30px";
        del.color = "black";
        del.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        del.onPointerDownObservable.add(() => {
          parameters.placedMeshes = parameters.placedMeshes.filter(
            (obj) => obj != parameters.highlightedMesh
          );
          parameters.highlightedMesh.dispose();
          parameters.highlightedMesh = null;
          this.createProductInfoMenu();
        });
        box.addControl(del);

        // nazwa produktu
        let title = new GUI.TextBlock("title", parameters.highlightedMesh.name);
        title.height = 1;
        title.width = "120px";
        title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        title.onLinesReadyObservable.add(() => {
          let textWidth = title.lines[0].width;
          let ratioWidths = title.widthInPixels / textWidth;
          if (ratioWidths < 1) {
            title.fontSize =
              parseFloat(title.fontSizeInPixels) * ratioWidths + "px";
          }
        });
        titleBox.addControl(title);

        //wymiary produktu
        let productDimension = new GUI.Rectangle("productDimension");
        productDimension.width = "70px";
        productDimension.height = "66px";
        productDimension.paddingTop = "20px";
        productDimension.thickness = 0;
        productDimension.horizontalAlignment =
          GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        productDetailBox.addControl(productDimension);

        let width = new GUI.TextBlock(
          "width",
          "X:" +
            (parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize
              .x *
              2) /
              10 +
            "cm"
        );
        width.height = "12px";
        width.fontSize = "12px";
        width.width = "70px";
        width.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        productDimension.addControl(width);

        let height = new GUI.TextBlock(
          "height",
          "Y:" +
            (parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize
              .y *
              2) /
              10 +
            "cm"
        );
        height.height = "12px";
        height.fontSize = "12px";
        height.width = "70px";
        height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        productDimension.addControl(height);

        let depth = new GUI.TextBlock(
          "depth",
          "Z:" +
            (parameters.highlightedMesh.getBoundingInfo().boundingBox.extendSize
              .z *
              2) /
              10 +
            "cm"
        );
        depth.height = "12px";
        depth.fontSize = "12px";
        depth.width = "70px";
        height.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        productDimension.addControl(depth);
      }
    };

    //tworzenie menu glownego
    this.createMainMenu = () => {
      this.contentPanel.clearControls();
      this.createHeader("Menu główne");
      //zawartosc menu
      this.contentPanel.addControl(this.marginBox("10px"));
      let roomSettingsBox = new GUI.Rectangle("roomSettingsBox");
      roomSettingsBox.width = "80%";
      roomSettingsBox.height = "140px";
      roomSettingsBox.thickness = 2;
      roomSettingsBox.color = "white";
      roomSettingsBox.cornerRadius = 5;
      this.contentPanel.addControl(roomSettingsBox);

      let stackRoomSettings = new GUI.StackPanel("stackRoomSettings");
      roomSettingsBox.addControl(stackRoomSettings);

      let title = new GUI.TextBlock("roomSettingsTitle", "Ustawienia Pokoju");
      title.fontSize = "18px";
      // title.height="20px"
      // title.width = "150px"
      title.color = "black";
      title.resizeToFit = true;
      title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      title.verticalAlignment = GUI.Control._VERTICAL_ALIGNMENT_TOP;
      stackRoomSettings.addControl(title);
      stackRoomSettings.addControl(this.marginBox("10px"));

      let stackRoomDimensions = new GUI.StackPanel("stackRoomDimensions");
      stackRoomDimensions.height = "20px";
      stackRoomDimensions.isVertical = false;
      stackRoomSettings.addControl(stackRoomDimensions);
      stackRoomSettings.addControl(this.marginBox("10px"));

      let labelRoomDimensions = new GUI.TextBlock(
        "labelRoomDimensions",
        "Wymiary pokoju:"
      );
      labelRoomDimensions.fontSize = "12px";
      labelRoomDimensions.color = "black";
      labelRoomDimensions.resizeToFit = true;
      // labelRoomDimensions.paddingLeft = "10px"
      stackRoomDimensions.addControl(labelRoomDimensions);

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
      stackRoomDimensions.addControl(groundWidthInput);

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
      stackRoomDimensions.addControl(groundHeigthInput);

      let boxWallScheme = new GUI.StackPanel("boxWallScheme");
      boxWallScheme.height = "40px";
      boxWallScheme.isVertical = false;
      stackRoomSettings.addControl(boxWallScheme);
      stackRoomSettings.addControl(this.marginBox("10px"));

      let labelWallScheme = new GUI.TextBlock(
        "labelRoomDimensions",
        "Typ ściany:"
      );
      labelWallScheme.fontSize = "12px";
      labelWallScheme.color = "black";
      labelWallScheme.resizeToFit = true;
      // labelRoomDimensions.paddingLeft = "10px"
      boxWallScheme.addControl(labelWallScheme);

      let groupWallScheme = new GUI.RadioGroup("groupWallScheme");
      // boxWallScheme.addControl(groupWallScheme);

      var addRadio = function (text, parent, wallScheme, isChecked) {
        var button = new GUI.RadioButton();
        button.width = "12px";
        button.height = "12px";
        button.color = "white";
        button.background = "black";
        button.isChecked = isChecked;

        button.onIsCheckedChangedObservable.add(function (state) {
          if (state) {
            console.log(text);
            parameters.selectedWallScheme = wallScheme;
          }
        });

        var header = GUI.Control.AddHeader(button, text, "30px", {
          isHorizontal: true,
          controlFirst: true,
        });
        header.height = "15px";
        header.fontSize = "12px";
        header.paddingLeft = "10px";
        header.color = "black";
        parent.addControl(header);
      };

      addRadio("O", boxWallScheme, ["NORTH", "SOUTH", "WEST", "EAST"], true);
      addRadio("U", boxWallScheme, ["NORTH", "WEST", "EAST"]);
      addRadio("L", boxWallScheme, ["NORTH", "EAST"]);
      addRadio("J", boxWallScheme, ["NORTH", "WEST"]);
      addRadio("_", boxWallScheme, ["NORTH"]);

      let buttonSetRoom = new GUI.Button.CreateSimpleButton(
        "buttonSetGroundSize",
        "Zapisz"
      );
      buttonSetRoom.width = "65px";
      buttonSetRoom.height = "18px";
      buttonSetRoom.paddingLeft = "5px";
      buttonSetRoom.color = "Black";
      // buttonSetRoom.paddingRight = "5px"
      buttonSetRoom.fontSize = "12px";
      buttonSetRoom.onPointerDownObservable.add(() => {
        parameters.groundWidth = groundWidthInput.text * 1000;
        parameters.groundHeigth = groundHeigthInput.text * 1000;
        parameters.ground.dispose();
        SceneBuilder.prepareGround();
        parameters.walls.map((wall) => wall.dispose());
        parameters.walls = [];
        parameters.selectedWallScheme.map((position) => {
          let wall = SceneBuilder.createWall(
            position,
            parameters.wallMaterial,
            position
          );
          parameters.walls.push(wall);
        });
      });
      stackRoomSettings.addControl(buttonSetRoom);
    };
  }
}

import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas",
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;
const FIRST_INDEX = 0;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//creating the tilemap nested array
let tilemap: string[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = imageUrls[FIRST_INDEX];
  }
  tilemap[i] = row;
}

//track the selected tile
let currentTile: string = imageUrls[FIRST_INDEX];

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  width: number,
  height: number,
  cellSize: number,
) {
  const image: HTMLImageElement = new Image();
  image.src = imageUrl;
  image.onload = () => {
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
  };
  ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        tilemap[i][j],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize,
      );
    }
  }
}
gridCanvas.addEventListener("mouseup", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = currentTile;
  redrawTilemap();
});

gridCanvas.addEventListener("mousedown", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);
  tilemap[coordX][coordY] = currentTile;
  drawTexture(
    coordX,
    coordY,
    gridCtx,
    currentTile,
    gridCanvas.width / numTiles,
    gridCanvas.height / numTiles,
    tileSize,
  );
});
const LEFT_BUTTON = 1;
gridCanvas.addEventListener("mousemove", (e) => {
  if (e.buttons == LEFT_BUTTON) {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);
    tilemap[coordX][coordY] = currentTile;
    drawTexture(
      coordX,
      coordY,
      gridCtx,
      currentTile,
      gridCanvas.width / numTiles,
      gridCanvas.height / numTiles,
      tileSize,
    );
  }
});

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const selectableImage = imageUrls[i];
    drawTexture(
      0,
      i,
      selectCtx,
      selectableImage,
      selectCanvas.width,
      selectHeight,
      64,
    );
  }
}

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = imageUrls[coordY];
});

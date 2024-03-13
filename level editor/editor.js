const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const drawColor = (r,g,b) => {
  ctx.fillStyle = `rgb(${r},${g},${b})`; 
  ctx.strokeStyle = `rgb(${r},${g},${b})`; 
}

canvas.width = 880 * (16/9);
canvas.height = 880;

// TO DO:
// in the key stuff section:
// add a mode so that tiles like walls will "snap together" when they're perpendicular to each other
// so that there aren't edges that stick out, so it looks like a perfect L
//
// and also on the topic of tiles, maybe make the walls and platforms kind of grid-align so that they all line up
//
// for cleaning up code:
// when i come back to this, clean up the border creation code, because right now i don't like it, but i'm too tired to fix it

class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    
    this.lmb = false;
    this.lmbAlreadyPressed = false;
    this.rmb = false;
    this.rmbAlreadyPressed = false;
  }
}

const mouse = new Mouse();
let keys = {};

class Rect {
  constructor(x,y,w,h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.type = ''; // wall, border, coin, etc.
  }
  
  collision(rect) {
    return this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y ? true : false;
  }
}

class Camera {
  constructor() {
    this.offset = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
  }

  drawBorder(rect) {
    ctx.beginPath();
    ctx.rect(rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
    ctx.stroke();
  }
  
  drawRect(rect) {
    ctx.fillRect(rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
  }
  
  drawImage(img, rect) {
    ctx.drawImage(img, rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
  }
}

const camera = new Camera();

const player = new Rect(0, 0, 80, 108);

class TileTool extends Rect {
  constructor() {
    super();
    this.w = 250;
    this.h = 10;

    this.placeAlreadyPressed = false;
    this.removeAlreadyPressed = false;

    this.tiles = [];

    this.data = {
      tiles: null,
      border: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    }

    this.borderToSet = 'none'; // left, top, right, bottom
  }

  update() {
    this.x = mouse.x + camera.offset.x - Math.floor(this.w/2);
    this.y = mouse.y + camera.offset.y - Math.floor(this.h/2);
  }

  show() { // show tile tool
    drawColor(255,255,0);
    camera.drawRect(new Rect(this.x, this.y, this.w, this.h));
  }

  setSize(w, h) {
    this.w = w;
    this.h = h;
    this.update(); // adding this makes it not look weird when switching sizes too quickly
  }
  
  placeTile() {
    if (mouse.x < 0 || mouse.x > canvas.width || mouse.y < 0 || mouse.y > canvas.height) return;
    let tile = new Rect(this.x, this.y, this.w, this.h);
    tile.type = 'wall';
    if (!player.collision(this)) this.tiles.push(tile);
  }
  
  removeTile() {
    let removedTile = false;
    let cursor = new Rect(this.x + Math.floor(this.w/2), this.y + Math.floor(this.h/2), 1, 1);
    this.tiles.forEach((tile, i) => {
      if (cursor.collision(tile)) {
        this.tiles.splice(i, 1);
        removedTile = true;
      };
    });
    return removedTile;
  }

  setBorder() {
    if (this.borderToSet == 'left') this.data.border.left = mouse.x + camera.offset.x;
    if (this.borderToSet == 'top') this.data.border.top = mouse.y + camera.offset.y;
    if (this.borderToSet == 'right') this.data.border.right = mouse.x + camera.offset.x;
    if (this.borderToSet == 'bottom') this.data.border.bottom = mouse.y + camera.offset.y;
    this.borderToSet = 'none';
  }
}

const tileTool = new TileTool();

function render() {
  drawColor(75,0,230);
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawColor(100,255,100);
  tileTool.tiles.forEach(tile => {
    camera.drawRect(tile);
  });

  drawColor(255,255,255);
  camera.drawRect(player);

  if (tileTool.borderToSet == 'none') tileTool.show();
  drawColor(255,0,0);
  if (tileTool.borderToSet == 'left' || tileTool.borderToSet == 'right') ctx.fillRect(mouse.x, mouse.y - canvas.height, 1, canvas.height*2); // display vertical bar
  if (tileTool.borderToSet == 'top' || tileTool.borderToSet == 'bottom') ctx.fillRect(mouse.x - canvas.width, mouse.y, canvas.width*2, 1) // display horizontal bar

  drawColor(255,0,0)
  camera.drawBorder({ x: tileTool.data.border.left, y: tileTool.data.border.top, w: Math.abs(tileTool.data.border.left - tileTool.data.border.right), h: Math.abs(tileTool.data.border.top - tileTool.data.border.bottom)});
}

function main() { // make it so that you can type in the width and height of the platform tool, like 200x50 for 200 wide and 50 high (i'll add it later, but i'm tired, so i'm going to bed, since it's like 2:08 AM 031224)
  render();
  if (keys['a']) camera.vel.x = -5;
  if (keys['d']) camera.vel.x = 5;
  if (!keys['a'] && !keys['d']) camera.vel.x = 0;

  if (keys['w']) camera.vel.y = -5;
  if (keys['s']) camera.vel.y = 5;
  if (!keys['w'] && !keys['s']) camera.vel.y = 0;

  camera.offset.x += camera.vel.x;
  camera.offset.y += camera.vel.y;

  tileTool.update();
  if (tileTool.borderToSet == 'none') {
    if (mouse.lmb && !tileTool.placeAlreadyPressed) {
      tileTool.placeTile();
      tileTool.placeAlreadyPressed = true;
    }
    if (mouse.rmb && !tileTool.removeAlreadyPressed) {
      if (tileTool.removeTile()) {
        tileTool.removeAlreadyPressed = true;
      }
    }
    if (!mouse.lmb) tileTool.placeAlreadyPressed = false;
    if (!mouse.rmb) tileTool.removeAlreadyPressed = false;
  } else {
    if (mouse.lmb) tileTool.setBorder();
  }

  console.log(tileTool.data.border)
}

function keyEventHandler(event) {
  if (event.type == 'keyup') keys[event.key] = false;

  if (keys[event.key]) return;
  if (event.type == 'keydown') keys[event.key] = true;

  // put a keydown thing here if you want it to only be ran once per keypress
  if (keys['Enter'] && event.key == 'Enter') tileTool.placeTile();

  if (keys['1'] && event.key == '1') tileTool.setSize(250, 10);
  if (keys['2'] && event.key == '2') tileTool.setSize(250, 20);
  if (keys['3'] && event.key == '3') tileTool.setSize(250, 30);
  if (keys['4'] && event.key == '4') tileTool.setSize(250, 40);
  if (keys['5'] && event.key == '5') tileTool.setSize(250, 50);
  if (keys['ArrowUp'] && event.key == 'ArrowUp') tileTool.setSize(tileTool.h, tileTool.w);

  if (keys['Delete'] && event.key == 'Delete') tileTool.borderToSet = 'left'; // set left border
  if (keys['Home'] && event.key == 'Home') tileTool.borderToSet = 'top'; // set top border
  if (keys['PageDown'] && event.key == 'PageDown') tileTool.borderToSet = 'right'; // set right border
  if (keys['End'] && event.key == 'End') tileTool.borderToSet = 'bottom'; // set bottom border
  
  // features from the OLD LEVEL EDITOR (may or may not implement some of these later)
  // move the camera x
  // if (keysPressed['ArrowLeft']) {
  //   camera.offsetVel.x = 5;
  // }
  // if (keysPressed['ArrowRight']) {
  //   camera.offsetVel.x = -5;
  // }
  // if (!keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
  //   camera.offsetVel.x = 0;
  // }

  // move the camera y
  // if (keysPressed['ArrowUp']) {
  //   camera.offsetVel.y = 5;
  // }
  // if (keysPressed['ArrowDown']) {
  //   camera.offsetVel.y = -5;
  // }
  // if (!keysPressed['ArrowUp'] && !keysPressed['ArrowDown']) {
  //   camera.offsetVel.y = 0;
  // }

  // width changer
  // if (keysPressed['-']) {
  //   if (camera.platformTool.width > 5) camera.platformTool.width -= 5;
  // }
  // if (keysPressed['=']) {
  //   camera.platformTool.width += 5
  // }

  // height changer
  // if (keysPressed['[']) {
  //   if (camera.platformTool.height > 5) camera.platformTool.height -= 5;
  // }
  // if (keysPressed[']']) {
  //   camera.platformTool.height += 5;
  // }

  // place platform when enter is pressed
  // if (keysPressed['Enter']) {
  //   camera.usePlatformTool(gameRects);
  // }

  // undo platform
  // if (keysPressed['z']) {
  //   if (gameRects.length > 0) gameRects.pop();
  // }

  // set the type of platform
  // if (keysPressed['1']) {
  //   camera.platformTool.type = '1';
  // }
  // if (keysPressed['2']) {
  //   camera.platformTool.type = '2';
  // }
}

function mousePosHandler(event) {
  let rect = canvas.getBoundingClientRect();
  mouse.x = Math.floor( (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width );
  mouse.y = Math.floor( (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height );
}

function mouseDownHandler(event) {
  if (event.button == 0) {
    mouse.lmb = true;
  }
  if (event.button == 2) {
    mouse.rmb = true;
  }
}
function mouseUpHandler(event) {
  if (event.button == 0) {
    mouse.lmb = false;
  }
  if (event.button == 2) {
    mouse.rmb = false;
  }
}

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener('mousemove', mousePosHandler);
document.addEventListener('mousedown', mouseDownHandler);
document.addEventListener('mouseup', mouseUpHandler);

document.addEventListener('keydown', keyEventHandler, true);
document.addEventListener('keyup', keyEventHandler, true);

function onClickCopyButton() {
  tileTool.data.tiles = tileTool.tiles;
  let copyableString = JSON.stringify(tileTool.data);
  // let copyableString = '[';
  // tileTool.tiles.forEach(tile => {
  //   copyableString += `{x:${tile.x},y:${tile.y},w:${tile.w},h:${tile.h},type:'${tile.type}'},`;
  // });
  // copyableString += '];';

  navigator.clipboard.writeText(`${copyableString}`);
  document.querySelector('button').innerText = 'Data copied!';
  setTimeout(() => { document.querySelector('button').innerText = 'Copy data'; }, 3000);
}

setInterval(() => {
  main();
}, 1000/60);
class Controller {
  constructor(canvas) {
    this.canvas = canvas;

    this.keys = {};
    this.mouse = { x: 0, y: 0, lmb: false, rmb: false };
  }

  keyHandler(event) {
    if (event.type == 'keyup') this.keys[event.key] = false;
    
    if (this.keys[event.key]) return;
    if (event.type == 'keydown') this.keys[event.key] = true;
  }

  mouseMoveHandler(event) {
    let rect = this.canvas.getBoundingClientRect();
    this.mouse.x = Math.floor( (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width );
    this.mouse.y = Math.floor( (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height );
  }

  mouseButtonHandler(event) {
    if (event.type == 'mousedown') {
      if (event.button == 0) this.lmb = true;
      if (event.button == 2) this.rmb = true;
    }
    if (event.type == 'mouseup') {
      if (event.button == 0) this.lmb = false;
      if (event.button == 0) this.lmb = false;
    }
  }
}
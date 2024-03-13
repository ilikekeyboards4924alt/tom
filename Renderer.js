class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    
    this.aspectRatio = 16/9;
    this.size = 880;
    this.width = Math.floor(this.size * this.aspectRatio);
    this.height = this.size
    this.ctx = canvas.getContext('2d');
  }


  drawColor(r,g,b) { 
    this.ctx.fillStyle = `rgb(${r},${g},${b})`; 
    this.ctx.strokeStyle = `rgb(${r},${g},${b})`; 
  }

  update() {
    this.drawColor(75, 0, 230); // (75, 0, 230) y (85, 150, 185)
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }

  resize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
}
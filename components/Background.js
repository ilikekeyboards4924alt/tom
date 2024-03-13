class Background {
  constructor(renderer, backgroundFrames, player) {
    this.renderer = renderer;
    this.backgroundFrames = backgroundFrames;
    this.player = player;

    // one layer per backgroundFrame
    this.layers = [
      [new Rect(0, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height*2, 0, this.renderer.height, this.renderer.height)],
      [new Rect(0, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height*2, 0, this.renderer.height, this.renderer.height)],
      [new Rect(0, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height, 0, this.renderer.height, this.renderer.height), new Rect(this.renderer.height*2, 0, this.renderer.height, this.renderer.height)],
    ];
  }

  draw() {
    this.layers.forEach((layer, i) => {
      layer.forEach((rect, j) => {
        if (i == 0) rect.x = Math.floor(this.player.x / 25) + this.renderer.height * j;
        if (i == 1) rect.x = Math.floor(this.player.x / 75) + this.renderer.height * j;
        if (i == 2) rect.x = Math.floor(this.player.x / 125) + this.renderer.height * j;

        if (rect.x > this.renderer.height) rect.x -= layer.length * this.renderer.height;
        if (rect.x + rect.w < 0) rect.x += layer.length * this.renderer.height;
      });
    });

    for (let i=this.layers.length-1;i>-1;i--) {
      this.layers[i].forEach(rect => {
        // split this into two if statements for negative and positive numbers because Math.floor doesn't work that well for negative numbers
        if (rect.x < 0) this.renderer.ctx.drawImage(this.backgroundFrames[i], -Math.floor(Math.abs(rect.x)), -Math.floor(Math.abs(rect.y)), rect.w, rect.h);
        if (rect.x >= 0) this.renderer.ctx.drawImage(this.backgroundFrames[i], Math.floor(rect.x), Math.floor(rect.y), rect.w, rect.h);
      });
    }
  }
  
  drawWaveBackground() { // draw the wave background (come back to this later if this becomes interesting enough)
    let startColor = [75, 0, 130];
    let endColor = [0, 0, 127];
    let steps = 10;

    let rStep = (endColor[0] - startColor[0]) / steps;
    let gStep = (endColor[1] - startColor[1]) / steps;
    let bStep = (endColor[2] - startColor[2]) / steps;

    let gradient = []; // list of all the colors in the gradient
    for (let i=0;i<steps;i++) {
      gradient.push([startColor[0] + rStep*i, startColor[1] + gStep*i, startColor[2] + bStep*i]);
    }

    let size = 500;
    let colorSize = size/steps;
    for (let y=0;y<steps;y++) {
      for (let x=0;x<this.renderer.width;x++) {
        let gradientNum = y;
        
        this.renderer.drawColor(gradient[gradientNum][0], gradient[gradientNum][1], gradient[gradientNum][2]);
        this.renderer.ctx.fillRect(x*colorSize,y*colorSize,colorSize,colorSize);
      }
    }
  }
}
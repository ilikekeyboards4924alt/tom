class Textures {
  constructor() {
    this.player = {
      walking: {
        left: [],
        right: []
      }
    };
    for (let i=0;i<10;i++) { // 8 instead of 4 since there's two sets of walking animations (left and right)
      let image = new Image();
      image.src = `./textures/player/walking/left/${i}.png`;
      this.player.walking.push(image);
    }
    for (let i=0;i<10;i++) { // 8 instead of 4 since there's two sets of walking animations (left and right)
      let image = new Image();
      image.src = `./textures/player/walking/right/${i}.png`;
      this.player.walking.push(image);
    }
  
    this.background = []; // 3 background layers (use for parallax background)
    for (let i=0;i<3;i++) {
      let image = new Image();
      image.src = `./textures/background/${i}.png`;
      this.background.push(image);
    }
  
    this.coin = []; // 14 frames of the coin spinning
    for (let i=0;i<14;i++) {
      let image = new Image();
      image.src = `./textures/coin/${i}.png`;
      this.coin.push(image);
    }
  
    this.heart; // heart ♥
    (() => {
      let image = new Image();
      image.src = './textures/mi amor.png';
      this.heart = image;
    })();
  }
}
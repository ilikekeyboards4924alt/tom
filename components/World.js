class World {
  constructor() {
    this.tiles = []; // parts of the world the player can collide with, couldn't think of a better name
    // this.staticTiles = []; // could be useful later
    // this.movingTiles = [];
  
    this.border = {
      top: -1000, // y of the top border
      left: -850 - 2000, // x of the left border
      right: 1250 + 2000, // x of the right border
      bottom: 500 // y of the bottom border
    }

    // this.time = 0; // add day and night at some point?
  }
}
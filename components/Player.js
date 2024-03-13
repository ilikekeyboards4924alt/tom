class Player extends AnimatedAsset {
  constructor(keyframes, x, y, w, h) {
    super(keyframes, x, y, w, h);
    this.vel = {
      x: 0,
      y: 0
    };
    this.ghostVel = {
      x: 0,
      y: 0
    };

    this.direction = 'left';

    this.jumpCount = 0;
    this.alreadyJumped = false; // so the player doesn't jump 60 times per second
  }

  update(frameCounter) {
    let nextKeyframe = 5; // after how many frames should the player go to the next keyframe of the walking animation
    this.currentFrameType = this.direction;
    if (this.direction == 'left') {
      if (this.vel.x == 0) this.currentFrame = 0;
      if (this.vel.x != 0 && frameCounter%nextKeyframe==0) this.currentFrame = (this.currentFrame+1)%10;
      return;
    }
    if (this.direction == 'right') {
      if (this.vel.x == 0) this.currentFrame = 0;
      if (this.vel.x != 0 && frameCounter%nextKeyframe==0) this.currentFrame = (this.currentFrame+1)%10;
      return;
    }
  }

  move(controller, world) {
    if (controller.keys['a']) {
      this.vel.x = -5;
      this.direction = 'left';
    }
    if (controller.keys['d']) {
      this.vel.x = 5;
      this.direction = 'right';
    }
    if (!controller.keys['a'] && !controller.keys['d']) this.vel.x = 0;

    if (controller.keys['w'] && !this.alreadyJumped && this.jumpCount < 5**10) {
      this.vel.y = -5;
      this.jumpCount += 1;
      this.alreadyJumped = true;
    }
    if (!controller.keys['w']) this.alreadyJumped = false;

    this.vel.y += 0.1;

    if (this.vel.x != 0) this.ghostVel.x = this.vel.x;
    if (this.vel.y != 0) this.ghostVel.y = this.vel.y;

    // this monster of a collision detection and correction system
    this.x += this.vel.x; 
    let cList = [];
    world.tiles.forEach(tile => {
      if (this.collision(tile)) cList.push(tile);
    });

    let closestTile = null;
    cList.forEach(cTile => {
      if (closestTile == null) closestTile = cTile;
      if (this.vel.x < 0) {
        // if the distance between the right edge of cTile and the center of the player
        // is greater than
        // the distance between the right edge of closestTile and the center of the player
        // closestTile equals cTile
        // why does this work? how does this work? I'm so confused
        // the best explanation I can come up with is that it's reversed since the velocity is negative, not sure why it's reversed though
        let cTileDistance = Math.abs(cTile.x + cTile.w - this.x + Math.floor(this.w/2));
        let closestTileDistance = Math.abs(closestTile.x + closestTile.w - this.x + Math.floor(this.w/2));
        if (cTileDistance > closestTileDistance) closestTile = cTile;
      } else if (this.vel.x > 0) {
        // if the distance between the left edge of cTile and the center of the player
        // is less than
        // the distance between the left edge of closestTile and the center of the player
        // closestTile equals cTile
        // this part makes sense
        let cTileDistance = Math.abs(cTile.x - this.x + Math.floor(this.w/2));
        let closestTileDistance = Math.abs(closestTile.x - this.x + Math.floor(this.w/2));
        if (cTileDistance < closestTileDistance) closestTile = cTile;
      }
    });

    if (closestTile != null) {
      if (this.ghostVel.x < 0) {
        this.x = closestTile.x + closestTile.w;
        this.vel.x = 0;
      } else if (this.ghostVel.x > 0) {
        this.x = closestTile.x - this.w;
        this.vel.x = 0;
      }
    }
    if (this.x < world.border.left) { this.x = world.border.left; this.vel.x = 0; }
    if (this.x + this.w > world.border.right) { this.x = world.border.right - this.w; this.vel.x = 0; }

    this.y += this.vel.y;
    cList = [];
    world.tiles.forEach(tile => {
      if (this.collision(tile)) cList.push(tile);
    });

    closestTile = null;
    cList.forEach(cTile => {
      if (closestTile == null) closestTile = cTile;
      if (this.vel.y < 0) {
        if (Math.abs(cTile.y + cTile.h - this.y + Math.floor(this.h/2)) > Math.abs(closestTile.y + closestTile.h - this.y + Math.floor(this.h/2))) closestTile = cTile;
      } else if (this.vel.y > 0) {
        if (Math.abs(cTile.y - this.y + Math.floor(this.h/2)) < Math.abs(closestTile.y - this.y + Math.floor(this.h/2))) closestTile = cTile;
      }
    });

    if (closestTile != null) {
      if (this.ghostVel.y < 0) {
        this.y = closestTile.y + closestTile.h + 1;
        this.vel.y = 0;
      } else if (this.ghostVel.y > 0) {
        this.y = closestTile.y - this.h;
        this.vel.y = 0;
      }
    }
    if (this.y < world.border.top) { this.y = world.border.top; this.vel.y = 0 }
    if (this.y + this.h > world.border.bottom) { this.y = world.border.bottom - this.h; this.vel.y = 0; }
  }
}
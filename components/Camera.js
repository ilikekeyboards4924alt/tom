class Camera {
  constructor(renderer) {
    this.renderer = renderer;

    this.offset = {
      x: 0,
      y: 0
    };
  
    this.scale = 1;
  }

  update(player, world) { // maybe change player to focus or focusRect?
    this.offset.x = player.x + Math.floor(player.w/2) - Math.floor(this.renderer.width/2);
    this.offset.y = player.y + Math.floor(player.h/2) - Math.floor(this.renderer.height/2);
    
    // clamps the player's camera between the world's 4 borders
    this.offset.x = Math.min(Math.max(world.border.left, this.offset.x), world.border.right - this.renderer.width);
    this.offset.y = Math.min(Math.max(world.border.top, this.offset.y), world.border.bottom - this.renderer.height);
  }

  drawBorder(rect) {
    this.renderer.ctx.beginPath();
    this.renderer.ctx.rect(rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
    this.renderer.ctx.stroke();
  }

  drawRect(rect) {
    this.renderer.ctx.fillRect(rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
  }

  drawImage(image, rect, size=false) {
    if (size == true) {
      this.renderer.ctx.drawImage(image, rect.x - this.offset.x, rect.y - this.offset.y, rect.w, rect.h);
    } else {
      this.renderer.ctx.drawImage(image, rect.x - this.offset.x, rect.y - this.offset.y);
    }
  }

  drawAnimatedAsset(animatedAsset) {
    this.renderer.ctx.drawImage(animatedAsset.keyframes[animatedAsset.currentFrame], animatedAsset.x - this.offset.x, animatedAsset.y - this.offset.y, animatedAsset.w, animatedAsset.h);
  }
}
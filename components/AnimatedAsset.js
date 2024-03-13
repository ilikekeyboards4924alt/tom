class AnimatedAsset extends Rect {
  constructor(spritesheet, x, y, w, h) {
    super(x, y, w, h);
    // this.keyframes = [];
    this.spritesheet = null;
    this.currentFrame = 0;
    this.currentFrameType = '';
  }

  // I've been thinking about how I could have multiple sets of animations in an animated asset, and here is one solution I thought of:
  // Maybe you store an id with the frames like
  // for walking left:
  // 0wl, 1wl, 2wl, 3wl
  // for walking right:
  // 0wr, 1wr, 2wr, 3wr
  // doesn't seem like a good fix, and it is 2:27 AM, so I'll get to that later
  
  // for now, I'll just get the coin to 'spin'

  // find a better way to do this later
  addKeyframes(keyframes, type) { // example for type, 0l, 1l, 2l, etc for walking left, 0r, 1r, 2r for walking right
    keyframes.forEach(keyframe => {
      this.keyframes.push({ keyframe, type });
    });
  }

  getKeyframes(type) {
    return this.keyframes.filter((keyframe, i) => { keyframe.type == type })
  }

  stepFrame() { // step through each keyframe in an animation
    this.currentFrame = (this.currentFrame+1)%this.keyframes.length; // any animation will loop if you go above the length of its keyframes list
  }
}
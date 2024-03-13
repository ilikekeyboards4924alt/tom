window.addEventListener('load', (event) => {
  let frameCounter = 0;

  // TO DO (when i come back):
  // add actual gameplay elements like
  // idk make an enemy or sumn
  // basic ai for enemy so it always follows you
  // make it throw rocks at you
  // when the rocks hit you, you take damage, and your health goes down
  // when your health gets to zero, you die
  // so make game over screen too
  // and a dying animation or effect

  // and also maybe take some of the core parts of this "game engine"
  // and make them more general
  // that way i can reuse some of this code on a new game in the future
  // maybe it call it something cool or professional
  // like
  // T-Engine™

  const renderer = new Renderer(document.querySelector('canvas'));
  const textures = new Textures();  
  const controller = new Controller(document.querySelector('canvas'));
  const camera = new Camera(renderer);
  const world = new World();
  
  const player = new Player(textures.player.walking, 0, 0, 80, 108);
  const background = new Background(renderer, textures.background, player);

  const coin = new AnimatedAsset(textures.coin, 375, 10, 64, 64);

  // import from level editor object
  // const worldData = {"tiles":[{"x":-85,"y":110,"w":250,"h":10,"type":"wall"},{"x":-335,"y":110,"w":250,"h":10,"type":"wall"},{"x":-560,"y":110,"w":250,"h":10,"type":"wall"},{"x":-805,"y":110,"w":250,"h":10,"type":"wall"},{"x":145,"y":110,"w":250,"h":10,"type":"wall"},{"x":435,"y":110,"w":250,"h":10,"type":"wall"},{"x":360,"y":110,"w":250,"h":10,"type":"wall"},{"x":650,"y":110,"w":250,"h":10,"type":"wall"},{"x":885,"y":110,"w":250,"h":10,"type":"wall"},{"x":-139,"y":-131,"w":10,"h":250,"type":"wall"},{"x":253,"y":-130,"w":10,"h":250,"type":"wall"},{"x":-332,"y":-385,"w":10,"h":250,"type":"wall"},{"x":413,"y":-395,"w":10,"h":250,"type":"wall"},{"x":618,"y":-131,"w":10,"h":250,"type":"wall"},{"x":-496,"y":-136,"w":10,"h":250,"type":"wall"},{"x":-680,"y":-392,"w":10,"h":250,"type":"wall"},{"x":801,"y":-396,"w":10,"h":250,"type":"wall"},{"x":970,"y":-132,"w":10,"h":250,"type":"wall"},{"x":-803,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-583,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-333,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-93,"y":-396,"w":250,"h":10,"type":"wall"},{"x":157,"y":-396,"w":250,"h":10,"type":"wall"},{"x":387,"y":-396,"w":250,"h":10,"type":"wall"},{"x":602,"y":-396,"w":250,"h":10,"type":"wall"},{"x":837,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-1010,"y":110,"w":250,"h":10,"type":"wall"},{"x":-1160,"y":110,"w":250,"h":10,"type":"wall"},{"x":-1295,"y":110,"w":250,"h":10,"type":"wall"},{"x":-1040,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-1265,"y":-396,"w":250,"h":10,"type":"wall"},{"x":-857,"y":-130,"w":10,"h":250,"type":"wall"},{"x":-1017,"y":-392,"w":10,"h":250,"type":"wall"},{"x":-1138,"y":-132,"w":10,"h":250,"type":"wall"},{"x":-487,"y":-1174,"w":250,"h":10,"type":"wall"},{"x":-51,"y":977,"w":250,"h":10,"type":"wall"}],"border":{"left":-1263,"top":-1169,"right":1085,"bottom":982}}
  // const worldData = {"tiles":[{"x":-85,"y":113,"w":250,"h":10,"type":"wall"},{"x":-85,"y":-129,"w":10,"h":250,"type":"wall"},{"x":155,"y":-127,"w":10,"h":250,"type":"wall"},{"x":-84,"y":-129,"w":250,"h":10,"type":"wall"}],"border":{"left":-742,"top":-390,"right":812,"bottom":478}};
  const worldData = {"tiles":[{"x":-85,"y":113,"w":250,"h":10,"type":"wall"},{"x":-126,"y":-127,"w":50,"h":250,"type":"wall"},{"x":148,"y":-127,"w":50,"h":250,"type":"wall"},{"x":-326,"y":-127,"w":250,"h":20,"type":"wall"},{"x":148,"y":-128,"w":250,"h":20,"type":"wall"},{"x":379,"y":-128,"w":250,"h":20,"type":"wall"},{"x":-576,"y":-127,"w":250,"h":20,"type":"wall"},{"x":-811,"y":-127,"w":250,"h":20,"type":"wall"},{"x":-816,"y":-357,"w":20,"h":250,"type":"wall"},{"x":-816,"y":-607,"w":20,"h":250,"type":"wall"},{"x":-816,"y":-897,"w":20,"h":250,"type":"wall"},{"x":-816,"y":-832,"w":20,"h":250,"type":"wall"},{"x":-816,"y":-1107,"w":20,"h":250,"type":"wall"},{"x":-816,"y":-1307,"w":20,"h":250,"type":"wall"},{"x":628,"y":-128,"w":250,"h":20,"type":"wall"},{"x":863,"y":-128,"w":250,"h":20,"type":"wall"},{"x":1093,"y":-373,"w":20,"h":250,"type":"wall"},{"x":1093,"y":-623,"w":20,"h":250,"type":"wall"},{"x":1093,"y":-788,"w":20,"h":250,"type":"wall"},{"x":1093,"y":-963,"w":20,"h":250,"type":"wall"},{"x":1093,"y":-1163,"w":20,"h":250,"type":"wall"},{"x":1093,"y":-1338,"w":20,"h":250,"type":"wall"},{"x":-384,"y":-335,"w":250,"h":20,"type":"wall"},{"x":320,"y":-328,"w":250,"h":20,"type":"wall"},{"x":-50,"y":-495,"w":250,"h":20,"type":"wall"},{"x":-704,"y":-504,"w":250,"h":20,"type":"wall"},{"x":615,"y":-504,"w":250,"h":20,"type":"wall"},{"x":-378,"y":-699,"w":250,"h":20,"type":"wall"},{"x":302,"y":-692,"w":250,"h":20,"type":"wall"},{"x":-692,"y":-898,"w":250,"h":20,"type":"wall"},{"x":-57,"y":-908,"w":250,"h":20,"type":"wall"},{"x":619,"y":-913,"w":250,"h":20,"type":"wall"},{"x":298,"y":-1138,"w":250,"h":20,"type":"wall"},{"x":-377,"y":-1144,"w":250,"h":20,"type":"wall"},{"x":64,"y":-612,"w":20,"h":250,"type":"wall"},{"x":58,"y":-1017,"w":20,"h":250,"type":"wall"}],"border":{"left":-1194,"top":-1720,"right":1703,"bottom":327}}
  worldData.tiles.forEach(worldTile => {
    world.tiles.push(new Rect(worldTile.x, worldTile.y, worldTile.w, worldTile.h));
  });
  world.border.left = worldData.border.left;
  world.border.top = worldData.border.top;
  world.border.right = worldData.border.right;
  world.border.bottom = worldData.border.bottom;

  document.addEventListener('keydown', event => controller.keyHandler(event));
  document.addEventListener('keyup', event => controller.keyHandler(event));

  document.addEventListener('mousemove', event => controller.mouseMoveHandler(event));
  document.addEventListener('mousedown', event => controller.mouseButtonHandler(event));
  document.addEventListener('mouseup', event => controller.mouseButtonHandler(event));

  renderer.resize();
  setInterval(() => {
    renderer.update();
    background.drawWaveBackground();
    background.draw();

    // renderer.drawColor(255,0,0);
    // camera.drawBorder(new Rect(world.border.left, world.border.top, Math.abs(world.border.left - world.border.right), Math.abs(world.border.top - world.border.bottom)));

    world.tiles.forEach(rect => {
      renderer.drawColor(75,75,75);
      camera.drawRect(rect);
    });

    camera.drawAnimatedAsset(coin);
    camera.drawAnimatedAsset(player);
    
    
    
    if (frameCounter%5==0) coin.stepFrame();
    
    world.tiles.forEach(rect => {
      if (rect.collision(new Rect(controller.mouse.x + camera.offset.x, controller.mouse.y + camera.offset.y, 1, 1))) {
        renderer.drawColor(255,0,0);
        camera.drawBorder(rect);
      }
    });

    player.move(controller, world);
    player.update(frameCounter);
    camera.update(player, world);

    frameCounter += 1;
  }, 1000/60);
});
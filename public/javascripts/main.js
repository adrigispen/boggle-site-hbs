function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas");
}

function draw() {
  if (game) game.draw();
}

function keyPressed() {
  game.keyPressed();
}

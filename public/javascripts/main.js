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

// function newGame() {
//   game = new Game(boardSize, players, generous, speed, language);
//   game.setup();
//   game.loadCurrentPlayer();

//   let findEndButton = document.getElementById("find-all");
//   findEndButton.style.display = "inline-block";
//   findEndButton.onclick = (() => game.findAllWords(language)).bind(game);
//   document.getElementById("enter-button").onclick = game.checkForWord.bind(
//     game
//   );
// }

class Game {
  constructor(board, players, id) {
    this.id = id;
    this.board = new Board(board);
    this.players = players.map(player => new Player(player));
    this.generous = board.generous;
    this.speed = board.shortTurns;
    this.isOver = false;
  }

  setup() {
    this.board.setup();
    this.players.forEach(player => {
      player.addToBoard(player.name);
      let wordsDiv = document.getElementById(player.name + "-player-list");
      let scoreDiv = document.getElementById(player.name + "-score");
      player.words.forEach(word => {
        wordsDiv.innerHTML += `<li>${word}</li>`;
      });
      scoreDiv.innerHTML = `pts: ${player.score}`;
    });
  }

  draw() {
    this.board.drawBoard();
    this.players.forEach(player => player.timer.draw(player.name));
    if (this.isOver) {
      let winner = this.getWinner();
      this.players.forEach(player => {
        document.getElementById(player.name + "-name").style.color =
          player.color;
        document.getElementById(player.name + "-player-list").style.display =
          "inline-block";
      });
      document.getElementById("word-entry").disabled = true;
      document.getElementById("enter-button").disabled = true;
      let button = document.getElementById("find-all");
      button.onclick = () => location.reload();
      button.style.backgroundColor = winner.color;
      button.innerHTML = "Play Again";
      this.board.drawBoard();
      var overlayColor = color("white");
      overlayColor.setAlpha(220);
      fill(overlayColor);
      strokeWeight(0.1);
      rect(0, 0, WIDTH, HEIGHT);
      fill(color(winner.color));
      push();
      textStyle(BOLD);
      text(`${winner.name} WINS!`, WIDTH / 2, HEIGHT / 4);
      pop();
      push();
      textFont("Avenir");
      textSize(20);
      textAlign(CENTER, BOTTOM);
      let scoresList = this.getTopScoresList();
      text(scoresList, WIDTH / 2, HEIGHT - 100);
      pop();
    }
  }

  getTopScoresList() {
    let text = "";
    this.players.forEach(player => {
      text += `${player.name}: ${player.score} points, ${
        player.timer.currentTime
      } seconds! SCORE: ${player.finalScore.toFixed(2)}\n\n`;
    });
    return text;
  }

  keyPressed() {
    if (keyCode == 13) {
      this.checkForWord();
    }
  }

  getCurrentPlayer() {
    return this.players.find(player => player.playingNow);
  }

  checkForWord() {
    clear();
    document.getElementById("error").innerHTML = "";
    let input = document.getElementById("word-entry");
    if (input.value == "") return;
    this.board.highlightWord(input.value, this.getCurrentPlayer());
    input.value = "";
    if (this.speed) {
      setTimeout(() => this.changePlayer(), 1500);
      input.disabled = true;
    }
    setTimeout(clear, 1500);
    setTimeout(() => this.clearErrors(), 1500);
  }

  saveToDB() {
    let newWords = this.getCurrentPlayer().words;
    let seconds = this.getCurrentPlayer().timer.currentTime;
    let points = this.getCurrentPlayer().score;
    let playerId = this.getCurrentPlayer().id;
    let userId = this.getCurrentPlayer().userId;
    axios
      .post("http://127.0.0.1:3000/save-game/" + this.id, {
        playerId,
        seconds,
        newWords,
        userId,
        points
      })
      .then(response => {
        //eh, here we are
      })
      .catch(err => {
        console.log(err);
      });
  }

  endGameDB() {
    let winner = this.getWinner();
    axios
      .post("http://127.0.0.1:3000/end-game/" + this.id, { winner })
      .then(response => {
        console.log("saved winner ended the game");
      })
      .catch(err => {
        console.log(err);
      });
  }

  changePlayer() {
    this.saveToDB();
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].playingNow) {
        let newIndex = (i + 1) % this.players.length;
        this.players[i].playingNow = false;
        document.getElementById(this.players[i].name + "-name").style.color =
          "#000";
        document.getElementById(this.players[i].name + "-timer").style.color =
          "#000";
        document.getElementById(
          this.players[i].name + "-wrapper"
        ).style.overflowY = "scroll";
        document.getElementById(
          this.players[i].name + "-player-list"
        ).style.display = "none";
        this.players[i].timer.stopTimer();
        if (!this.speed) {
          this.players[i].turnOver = true;
          document.getElementById(
            this.players[i].name + "-turn-done"
          ).style.display = "none";
          document.getElementById(
            this.players[newIndex].name + "-turn-done"
          ).disabled = false;
        }
        document.getElementById("error").innerHTML = "";
        if (this.players[newIndex].turnOver == true) this.findAllWords();
        this.players[newIndex].playingNow = true;
        document.getElementById(
          this.players[newIndex].name + "-name"
        ).style.color = this.players[newIndex].color;
        document.getElementById(
          this.players[newIndex].name + "-timer"
        ).style.color = this.players[newIndex].color;
        document.getElementById(
          this.players[newIndex].name + "-player-list"
        ).style.display = "inline-block";
        this.players[newIndex].timer.startTimer();
        break;
      }
    }
    let input = document.getElementById("word-entry");
    input.disabled = false;
    input.focus();
  }

  clearErrors() {
    document.getElementById("error").innerHTML = "";
  }

  findAllWords() {
    document.getElementById("waiting").style.visibility = "visible";
    document.getElementById("waiting").style.display = "inline";
    if (!this.speed) this.calibrateScores();
    setTimeout(() => this.board.findAllWords(), 100);
    this.isOver = true;
    this.endGameDB();
  }

  endGame() {
    // display some message about timeout
    this.findAllWords();
  }

  calibrateScores() {
    let allWordsFound = this.players
      .map(player => player.words)
      .reduce((acc, cv) => acc.concat(cv), []);
    let multiples = allWordsFound.filter(
      (elem, index, arr) =>
        arr.indexOf(elem) === index && arr.lastIndexOf(elem) !== index
    );
    this.players.forEach(player => {
      let dups = player.words.filter(word => multiples.includes(word));
      console.log("in player, here are the duplicates ", dups);
      dups.forEach(elem => (player.score -= this.board.getScore(elem)));
    });
    console.log(this.players);
  }

  getWinner() {
    this.players.map(player => {
      player.timer.stopTimer();
      player.finalScore =
        player.timer.currentTime == 0
          ? 0
          : (player.score / player.timer.currentTime) * 100;
      return player;
    });
    this.players.sort((a, b) => b.finalScore - a.finalScore);
    return this.players[0].finalScore == 0
      ? new Player("Boggle Bot")
      : this.players[0];
  }

  showSolutions() {
    this.findAllWords();
    document.getElementById("game").style.display = "initial";
    this.board.createHighlightedList();
  }
}

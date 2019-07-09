class Board {
  // constructor(dimension) {
  //   this.dimension = dimension;
  //   this.dictionary = new Typo("en_US", false, false, {
  //     dictionaryPath: "/javascripts/typo/dictionaries"
  //   });
  //   this.letterMatrix = [];
  //   this.words = [];
  //   for (var i = 0; i < this.dimension; i++) {
  //     this.letterMatrix[i] = [];
  //     for (var j = 0; j < this.dimension; j++) {
  //       this.letterMatrix[i].push(getRandomLetter().toUpperCase());
  //     }
  //   }
  // }

  constructor(board) {
    this.dimension = board.letterMatrix.length;
    this.dictionary = new Typo("en_US", false, false, {
      dictionaryPath: "/javascripts/typo/dictionaries"
    });
    this.letterMatrix = board.letterMatrix;
    this.words = [];
  }

  setup() {}

  drawBoard() {
    textFont("Avenir");
    textSize(60);
    textAlign(CENTER, CENTER);
    //draw letters
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        fill(0);
        text(
          this.letterMatrix[i][j],
          j * SQUARE_SIDE + SQUARE_SIDE / 2,
          i * SQUARE_SIDE + SQUARE_SIDE / 2
        );
      }
      //draw lines
      line(0, i * SQUARE_SIDE, SQUARE_SIDE * this.dimension, i * SQUARE_SIDE);
      line(i * SQUARE_SIDE, 0, i * SQUARE_SIDE, SQUARE_SIDE * this.dimension);
    }
    //draw final lines
    line(
      0,
      this.dimension * SQUARE_SIDE,
      SQUARE_SIDE * this.dimension,
      this.dimension * SQUARE_SIDE
    );
    line(
      this.dimension * SQUARE_SIDE,
      0,
      SQUARE_SIDE * this.dimension,
      this.dimension * SQUARE_SIDE
    );
  }

  highlightWord(word, player) {
    let error = document.getElementById("error");
    word = word.toLowerCase();
    if (this.dictionary.check(word)) {
      let squares = this.findWord(word);
      if (Array.isArray(squares)) {
        squares.forEach(position => {
          fill(color(player.color));
          rect(
            SQUARE_SIDE * position.col,
            SQUARE_SIDE * position.row,
            SQUARE_SIDE,
            SQUARE_SIDE
          );
        });
        let wordList = game.speed
          ? game.players
              .map(player => player.words)
              .reduce((acc, cv) => acc.concat(cv), [])
          : player.words;
        if (!wordList.includes(word)) {
          document.getElementById(
            player.name + "-player-list"
          ).innerHTML += `<li>${word}</li>`;
          player.score += this.getScore(word);
          player.words.push(word);
          document.getElementById(player.name + "-score").innerHTML = `pts: ${
            player.score
          }`;
        } else {
          error.innerHTML = `<h2>${word[0].toUpperCase() +
            word.slice(1)} already found!</h2>`;
        }
      } else {
        error.innerHTML = `<h2>I'm sorry, ${word} isn't on the board!</h2>`;
      }
    } else {
      error.innerHTML = `<h2>I'm sorry, ${word} is not a valid word in English.</h2>`;
    }
  }

  getScore(word) {
    switch (word.length) {
      case 1:
      case 2:
        return 0;
      case 3:
      case 4:
        return 1;
      case 5:
        return 2;
      case 6:
        return 3;
      case 7:
        return 5;
      default:
        return 11;
    }
  }

  // checks if words are on the board
  findWord(word) {
    let paths = [];
    let letter = word[0].toUpperCase();
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        if (this.letterMatrix[i][j] == letter) {
          let path = [{ row: i, col: j, letter: letter }];
          paths.push(path);
        }
      }
    }
    return this.checkNeighbors(paths, word.toUpperCase());
  }

  checkNeighbors(paths, fullWord) {
    if (paths.length == 0) return "nothing found";
    let path = paths.pop();
    if (path.length == fullWord.length) return path;
    let next = fullWord[path.length];
    let position = path[path.length - 1];

    let rowStart = position.row - 1 < 0 ? 0 : position.row - 1;
    let colStart = position.col - 1 < 0 ? 0 : position.col - 1;
    let rowEnd =
      position.row + 2 > this.dimension ? this.dimension : position.row + 2;
    let colEnd =
      position.col + 2 > this.dimension ? this.dimension : position.col + 2;
    for (var i = rowStart; i < rowEnd; i++) {
      for (var j = colStart; j < colEnd; j++) {
        let positionOkay = game.generous
          ? true
          : !this.alreadyUsed(path, { row: i, col: j });
        if (
          this.letterMatrix[i][j] == next &&
          !(position.row == i && position.col == j) &&
          positionOkay
        ) {
          if (path.length + 1 == fullWord.length) {
            paths = [];
            path.push({ row: i, col: j, letter: next });
            return path;
          }
          let pathCopy = Array.from(path);
          pathCopy.push({ row: i, col: j, letter: next });
          paths.push(pathCopy);
        }
      }
    }
    if (paths.length != 0) {
      return this.checkNeighbors(paths, fullWord);
    }
    return "nothing found";
  }

  alreadyUsed(path, position) {
    return path.find(
      elem => elem.row == position.row && elem.col == position.col
    );
  }

  // Print generated solutions

  findAllWords() {
    this.words = [];
    let dictionaryWords = Object.keys(this.dictionary.dictionaryTable);

    dictionaryWords.forEach(word => {
      if (
        this.dictionary.check(word.toLowerCase()) &&
        word.length > 2 &&
        !this.words.includes(word.toUpperCase()) &&
        Array.isArray(this.findWord(word))
      ) {
        this.words.push(word.toUpperCase());
      }
    });
    this.words.sort((a, b) => a.length - b.length);
    console.log(this.words);
    this.printAllWords();
  }

  printAllWords() {
    let html = "";
    if (this.words.length == 0) {
      html += "No words found.";
    }
    this.words.forEach(word => (html += `<li>${word}</li>`));
    this.createHighlightedList();
    [...document.getElementsByClassName("score-time-wrapper")].forEach(
      elem => (elem.style.display = "none")
    );
  }

  createHighlightedList() {
    let listPanel = document.getElementById("highlighted-list");
    listPanel.style.display = "inline-block";
    let list = document.createElement("ul");
    let allWordsFound = game.players
      .map(player => player.words)
      .reduce((acc, cv) => acc.concat(cv), []);
    console.log(allWordsFound);
    let multiples = allWordsFound.filter(
      (elem, index, arr) =>
        arr.indexOf(elem) === index && arr.lastIndexOf(elem) !== index
    );
    console.log(multiples);
    this.words.forEach(word => {
      let listItem = document.createElement("li");
      listItem.innerHTML = word;
      if (multiples.includes(word) || multiples.includes(word.toLowerCase())) {
        console.log("here");
        listItem.innerHTML = `<span style="text-decoration:line-through">${word}</span>`;
      } else {
        game.players.forEach(player => {
          if (
            player.words.includes(word.toLowerCase()) ||
            player.words.includes(word.toUpperCase())
          )
            listItem.innerHTML = `<span style='color: ${
              player.color
            }'>${word}</span>`;
        });
      }
      list.appendChild(listItem);
    });
    listPanel.appendChild(list);
  }
}

class Player {
  // constructor(name) {
  //   this.name = name;
  //   this.timer = new Timer();
  //   this.words = [];
  //   this.score = 0;
  //   this.color = getRandomColor();
  //   this.playingNow = false;
  //   this.turnOver = false;
  // }

  constructor(player) {
    this.name = player.displayName;
    this.timer = new Timer(player.seconds);
    this.words = player.words;
    this.score = player.points;
    this.color = player.color;
    this.playingNow = player.currentPlayer;
    this.id = player._id;
    this.userId = player.user;
    this.turnOver = false;
  }

  setCurrentPlayer() {
    this.playingNow = true;
    document.getElementById(this.name + "-name").style.color = this.color;
    document.getElementById(this.name + "-timer").style.color = this.color;
    document.getElementById(this.name + "-player-list").style.display =
      "inline-block";
    if (!game.speed)
      document.getElementById(this.name + "-turn-done").disabled = false;
    game.players.forEach(player => {
      if (player.name != this.name) {
        document.getElementById(player.name + "-wrapper").style.overflowY =
          "hidden";
        document.getElementById(player.name + "-player-list").style.display =
          "none";
      }
    });
    this.timer.startTimer();
  }

  addToBoard() {
    let parent = document.getElementById("player-display-list");
    let wrapper = document.createElement("div");
    wrapper.classList.add("player-display");
    wrapper.id = this.name + "-wrapper";
    let name = document.createElement("span");
    name.id = this.name + "-name";
    name.innerHTML = this.name;
    let timer = document.createElement("div");
    timer.id = this.name + "-timer";
    timer.classList.add("timer");
    let heading = document.createElement("h3");
    heading.classList.add("list-header");
    heading.innerHTML = "Words Found:";
    let score = document.createElement("div");
    score.id = this.name + "-score";
    score.classList.add("score");
    score.innerHTML = "pts: 0";
    let scoreTimeWrapper = document.createElement("div");
    scoreTimeWrapper.classList.add("score-time-wrapper");
    scoreTimeWrapper.appendChild(timer);
    scoreTimeWrapper.appendChild(score);
    let orderedList = document.createElement("ol");
    let listItems = document.createElement("div");
    listItems.id = this.name + "-player-list";
    let doneButton = document.createElement("button");
    doneButton.id = this.name + "-turn-done";
    doneButton.innerHTML = "End turn";
    doneButton.onclick = () => game.saveToDB();
    doneButton.disabled = true;
    // let link = document.createElement("a");
    // link.href = `/game/${game.id}`;
    // link.innerHTML = "Save game";
    let hr = document.createElement("hr");

    orderedList.appendChild(listItems);
    wrapper.appendChild(name);
    wrapper.appendChild(scoreTimeWrapper);
    wrapper.appendChild(orderedList);
    if (!game.speed) wrapper.appendChild(doneButton);
    // wrapper.appendChild(link);
    wrapper.appendChild(hr);

    parent.appendChild(wrapper);
    this.timer.draw(this.name);
  }
}

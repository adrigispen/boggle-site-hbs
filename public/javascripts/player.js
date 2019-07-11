class Player {
  constructor(player) {
    this.name = player.displayName;
    this.timer = new Timer(player.seconds);
    this.words = player.words;
    this.score = player.points;
    this.color = player.color;
    this.playingNow = player.currentPlayer;
    this.id = player._id;
    this.userId = player.user;
    this.turnOver = player.turnOver;
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
    doneButton.onclick = () => game.endTurn();
    doneButton.disabled = true;
    let hr = document.createElement("hr");

    orderedList.appendChild(listItems);
    wrapper.appendChild(name);
    wrapper.appendChild(scoreTimeWrapper);
    wrapper.appendChild(orderedList);
    if (!game.speed) wrapper.appendChild(doneButton);
    wrapper.appendChild(hr);

    parent.appendChild(wrapper);
    this.timer.draw(this.name);
  }
}

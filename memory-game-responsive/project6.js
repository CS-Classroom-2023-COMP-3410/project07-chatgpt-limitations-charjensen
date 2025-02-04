document.addEventListener("DOMContentLoaded", () => {
  const gameGrid = document.getElementById("game-grid");
  const moveCounter = document.getElementById("move-counter");
  const timer = document.getElementById("timer");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const fruitBorderContainer = document.querySelector(".fruit-border");

  const cards = [
    "🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓",
    "🍒", "🍒", "🍍", "🍍", "🥝", "🥝", "🍉", "🍉"
  ];

  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameTimer = null;
  let secondsElapsed = 0;
  let gameStarted = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function initializeGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    secondsElapsed = 0;
    moveCounter.textContent = moves;
    timer.textContent = "0:00";
    clearInterval(gameTimer);
    gameGrid.innerHTML = "";
    gameStarted = true;
    restartButton.disabled = false;
    startButton.disabled = true;

    shuffle(cards).forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner");

      const cardFront = document.createElement("div");
      cardFront.classList.add("card-front");

      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");
      cardBack.textContent = card;

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardElement.appendChild(cardInner);
      cardElement.addEventListener("click", flipCard);
      gameGrid.appendChild(cardElement);
    });

    adjustFruitBorder();
    startTimer();
  }

  function startTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
      secondsElapsed++;
      const minutes = Math.floor(secondsElapsed / 60);
      const seconds = secondsElapsed % 60;
      timer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }

  function flipCard() {
    if (!gameStarted || flippedCards.length === 2) return;
    if (!this.classList.contains("flip")) {
      this.classList.add("flip");
      flippedCards.push(this);
      if (flippedCards.length === 2) {
        moves++;
        moveCounter.textContent = moves;
        checkForMatch();
      }
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.textContent === card2.textContent) {
      card1.classList.add("match");
      card2.classList.add("match");
      matchedPairs++;
      flippedCards = [];
      if (matchedPairs === cards.length / 2) {
        clearInterval(gameTimer);
        alert(`Congratulations! You won in ${moves} moves and ${timer.textContent}`);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
        flippedCards = [];
      }, 1000);
    }
  }

  function adjustFruitBorder() {
    fruitBorderContainer.innerHTML = "";
    const containerRect = document.querySelector(".game-container").getBoundingClientRect();
    const fruitSize = 30;
    const offset = 0; // To ensure the border is larger than the game container

    for (let x = containerRect.left - offset; x < containerRect.right + 60; x += fruitSize) {
      createFruit(x, containerRect.top - offset);
      createFruit(x, containerRect.bottom + 60 - fruitSize);
    }

    for (let y = containerRect.top + 40; y < containerRect.bottom + offset; y += fruitSize) {
      createFruit(containerRect.left - offset, y);
      createFruit(containerRect.right + 80 - fruitSize, y);
    }
  }

  function createFruit(x, y) {
    const fruits = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥝", "🍉"];
    const fruitItem = document.createElement("div");
    fruitItem.classList.add("fruit-item");
    fruitItem.textContent = fruits[Math.floor(Math.random() * fruits.length)];
    fruitItem.style.left = `${x}px`;
    fruitItem.style.top = `${y}px`;
    fruitBorderContainer.appendChild(fruitItem);
  }

  startButton.addEventListener("click", initializeGame);
  restartButton.addEventListener("click", initializeGame);

  window.addEventListener("resize", adjustFruitBorder);
});
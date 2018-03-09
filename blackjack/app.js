//  Card Variables
const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
const values = [
  '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K', 'A'
];

const startBtn = document.querySelector('#start');
const hitBtn = document.querySelector('#hit');
const stayBtn = document.querySelector('#stay');
const message = document.querySelector('#message');
const scoreDisplay = document.querySelector('#scoreDisplay');
const playerCardUi = document.querySelector('#playerCards');
const dealerCardUi = document.querySelector('#dealerCards');

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerWon = false;

hitBtn.style.display = 'none';
stayBtn.style.display = 'none';

//  Update Scores
function tallyScore(hand) {
  let sum = 0;
  let hasAce = false;
  for(let card of hand) {
    sum += card.Points;
    if (card.Value === 'A') {
      hasAce = true;
    }
  }
  if (hasAce && sum < 12) {
    return sum + 10;
  }
  return sum;
}

function updateScores() {
  playerScore = tallyScore(playerHand);
  dealerScore = tallyScore(dealerHand);
}

function updateDisplays() {
  scoreDisplay.textContent = `Total Player Points: ${playerScore}`;
  dealerDisplay.textContent = `Total Dealer Points: ${dealerScore}`;
  displayCards(playerCardUi, playerHand);
  displayCards(dealerCardUi, dealerHand);
}

//  Build Deck Of Cards
function buildDeck(array) {
  for(let x = 0; x < suits.length; x++) {
    for(let y = 0; y < values.length; y++) {
      let points;

      if (values[y] === 'J' || values[y] === 'Q' || values[y] === 'K') {
        points = 10;
      }
      else if (values[y] === 'A') {
        points = 1;
      }
      else {
        points = parseInt(values[y]);
      }
      let card = { Value: values[y], Suit: suits[x], Points: points };
      deck.push(card);
    }
  }
}

//  Fisher-Yates Card Shuffle
function shuffle(array) {
  let currentIndex = array.length;
  let tempValue;
  let randomIndex;

  // While there remain elements to shuffle…
  while (currentIndex) {

    // Pick a remaining element…
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    tempValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
}

function getNextCard(deck, hand) {
  let card = deck.pop()
  hand.push(card);
}

function checkForEnd() {
  if (playerScore === 21) {
    gameOver = true;
    playerWon = true;
  }
  else if (dealerScore === 21) {
    gameOver = true;
    playerWon = false;
  }
  else {
    /*  A set of rules for dealer to follow when player
    is finished with his turn */
    if (gameOver) {
      while (dealerScore < 17) {
        getNextCard(deck, dealerHand);
        updateScores();
        updateDisplays();
      }
    }
    // Different message triggered depending on which conditions prevail
    if (playerScore > 21) {
      gameOver = true;
      playerWon = false;
    }
    else if (dealerScore > 21) {
      gameOver = true;
      playerWon = true;
    }
    else if (gameOver) {
      if (playerScore > dealerScore) {
        gameOver = true;
        playerWon = true;
      }
      else {
        gameOver = true;
        playerWon = false;
      }
    }
  }
  if (gameOver && playerWon) {
    hitBtn.style.display = 'none';
    stayBtn.style.display = 'none';
    startBtn.textContent = 'Restart';
    message.textContent = 'You Win!';
  }
  if (gameOver && playerWon!==true) {
    hitBtn.style.display = 'none';
    stayBtn.style.display = 'none';
    startBtn.textContent = 'Restart';
    message.textContent = 'You lose!';
  }
}

function displayCards(cardUi, hand) {
  cardUi.innerHTML = '';
  hand.forEach((card) => {
    let el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<p>${card.Value} of ${card.Suit}</p>`;
    cardUi.appendChild(el);
  })
}

function reset() {
  startBtn.textContent = 'Start';
  gameOver = false;
  playerWon = false;
  message.innerHTML = '';
  deck.splice(0, deck.length);
  playerHand.splice(0, playerHand.length);
  dealerHand.splice(0, dealerHand.length);
}
//  Button Functions
function newGame() {
  reset();
  buildDeck(deck);
  shuffle(deck);
  for (let i = 0; i < 2; i++) {
    getNextCard(deck, dealerHand);
    getNextCard(deck, playerHand);
  }
  updateScores();
  updateDisplays();
  hitBtn.style.display = 'inline';
  stayBtn.style.display = 'inline';
  checkForEnd();
}

function hit() {
  playerCards.innerHTML = '';
  getNextCard(deck, playerHand);
  updateScores();
  updateDisplays();
  checkForEnd();
}

function stay() {
  gameOver = true;
  checkForEnd();
}

//  Listeners
startBtn.addEventListener('click', () => {
  newGame();
});

hitBtn.addEventListener('click', () => {
  hit();
})

stayBtn.addEventListener('click', () => {
  stay();
})

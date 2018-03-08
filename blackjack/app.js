//  Card Variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = [
  '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K', 'A'
];

//DOM Variables
let startBtn = document.querySelector('#start');
let hitBtn = document.querySelector('#hit');
let stayBtn = document.querySelector('#stay');
let message = document.querySelector('#message');
let scoreDisplay = document.querySelector('#scoreDisplay');
let playerCards = document.querySelector('#playerCards');
let dealerCards = document.querySelector('#dealerCards');

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
    message.textContent = 'You Win!';
  }
  else {
    if (gameOver) {
      while (dealerScore < 17) {
        getNextCard(deck, dealerHand);
        updateScores();
        showCards(dealerCards, dealerHand)
        dealerDisplay.textContent = `Total Dealer Points: ${dealerScore}`;
      }
    }
    if (playerScore > 21) {
      gameOver = true;
      message.textContent = 'You Lose!';
      hitBtn.style.display = 'none';
      stayBtn.style.display = 'none';
    }
    else if (dealerScore > 21) {
      gameOver = true;
      message.textContent = 'You Win!';
      hitBtn.style.display = 'none';
      stayBtn.style.display = 'none';
    }
    else if (gameOver) {
      if (playerScore > dealerScore || playerScore === 21) {
        message.textContent = 'You Win!';
      }
      else {
        message.textContent = 'You Lose!';
      }
    }
  }
}

function showCards(showCards, hand) {
  showCards.innerHTML = '';
  hand.forEach((card) => {
    let el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<p>${card.Value} of ${card.Suit}</p>`;
    showCards.appendChild(el);
  })

}

function newGame() {
  gameOver = false;
  playerWon = false;
  message.innerHTML = '';
  deck.splice(0, deck.length);
  playerHand.splice(0, playerHand.length);
  dealerHand.splice(0, dealerHand.length);
  buildDeck(deck);
  shuffle(deck);
  for (let i = 0; i < 2; i++) {
    getNextCard(deck, dealerHand);
    getNextCard(deck, playerHand);
  }
  updateScores();
  checkForEnd();
  scoreDisplay.textContent = `Total Player Points: ${playerScore}`;
  dealerDisplay.textContent = `Total Dealer Points: ${dealerScore}`;
  showCards(playerCards, playerHand);
  showCards(dealerCards, dealerHand);
  hitBtn.style.display = 'inline';
  stayBtn.style.display = 'inline';
}

function hit() {
  playerCards.innerHTML = '';
  getNextCard(deck, playerHand);
  updateScores();
  scoreDisplay.textContent = `Total Player Points: ${playerScore}`;
  dealerDisplay.textContent = `Total Dealer Points: ${dealerScore}`;
  showCards(playerCards, playerHand);

  checkForEnd();
}

function stay() {
  gameOver = true;
  checkForEnd();
}

//  Listeners
startBtn.addEventListener('click', () => {
  newGame();
  console.log(playerHand);
  console.log(dealerHand);
  console.log(deck);
});

hitBtn.addEventListener('click', () => {
  hit();
  console.log(deck);
  console.log(playerHand);
  console.log(dealerHand);
})

stayBtn.addEventListener('click', () => {
  stay();
})

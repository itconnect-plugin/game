const EMOJIS = [
  "🐶",
  "🐱",
  "🦊",
  "🐼",
  "🦁",
  "🐸",
  "🐷",
  "🐵",
];

const gridElement = document.getElementById("card-grid");
const attemptsElement = document.getElementById("attempt-count");
const messageElement = document.getElementById("congrats-message");
const resetButton = document.getElementById("reset-button");
const cardTemplate = document.getElementById("card-template");

const GAME_SIZE = 16;
const MATCH_TARGET = GAME_SIZE / 2;

const gameState = {
  deck: [],
  flippedCards: [],
  attempts: 0,
  matches: 0,
  lockBoard: false,
};

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const createDeck = () => {
  const duplicated = [...EMOJIS, ...EMOJIS].slice(0, GAME_SIZE);
  const shuffled = shuffle(duplicated);
  return shuffled.map((emoji, index) => ({
    id: `${emoji}-${index}`,
    emoji,
  }));
};

const updateAttempts = () => {
  attemptsElement.textContent = gameState.attempts.toString();
};

const showCongrats = () => {
  messageElement.hidden = false;
};

const hideCongrats = () => {
  messageElement.hidden = true;
};

const resetBoardState = () => {
  gameState.flippedCards = [];
  gameState.lockBoard = false;
};

const handleMatchedPair = () => {
  gameState.matches += 1;
  resetBoardState();
  if (gameState.matches === MATCH_TARGET) {
    showCongrats();
  }
};

const unflipCards = () => {
  const [firstCard, secondCard] = gameState.flippedCards;
  if (firstCard && secondCard) {
    firstCard.classList.remove("card--flipped");
    secondCard.classList.remove("card--flipped");
  }
  resetBoardState();
};

const handleCardClick = (event) => {
  const card = event.currentTarget;
  if (
    gameState.lockBoard ||
    card.classList.contains("card--flipped") ||
    card.classList.contains("card--matched")
  ) {
    return;
  }

  card.classList.add("card--flipped");
  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length < 2) {
    return;
  }

  gameState.lockBoard = true;
  gameState.attempts += 1;
  updateAttempts();

  const [firstCard, secondCard] = gameState.flippedCards;
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add("card--matched");
    secondCard.classList.add("card--matched");
    handleMatchedPair();
  } else {
    // Wait before flipping back to provide visual feedback
    setTimeout(unflipCards, 1000);
  }
};

const renderDeck = () => {
  gridElement.innerHTML = "";
  const fragment = document.createDocumentFragment();

  gameState.deck.forEach((cardData) => {
    const cardNode = cardTemplate.content.firstElementChild.cloneNode(true);
    const frontFace = cardNode.querySelector(".card__face--front");
    frontFace.textContent = cardData.emoji;
    cardNode.dataset.emoji = cardData.emoji;
    cardNode.dataset.cardId = cardData.id;
    cardNode.addEventListener("click", handleCardClick);
    fragment.appendChild(cardNode);
  });

  gridElement.appendChild(fragment);
};

const resetGame = () => {
  gameState.deck = createDeck();
  gameState.flippedCards = [];
  gameState.attempts = 0;
  gameState.matches = 0;
  gameState.lockBoard = false;
  updateAttempts();
  hideCongrats();
  renderDeck();
};

resetButton.addEventListener("click", resetGame);

resetGame();

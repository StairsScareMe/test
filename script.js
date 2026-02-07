const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const restartButton = document.getElementById("restart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const speed = 120;
let lastMoveTime = 0;
let rafId = null;

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

let state = {};

const loadBestScore = () => {
  const stored = Number(localStorage.getItem("snake-best"));
  return Number.isFinite(stored) ? stored : 0;
};

const saveBestScore = (value) => {
  localStorage.setItem("snake-best", String(value));
};

const placeFood = (snake) => {
  let candidate = null;
  do {
    candidate = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));
  return candidate;
};

const resetGame = () => {
  state = {
    snake: [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ],
    direction: { x: 1, y: 0 },
    queuedDirection: { x: 1, y: 0 },
    food: null,
    score: 0,
    bestScore: loadBestScore(),
    paused: false,
    gameOver: false,
  };
  state.food = placeFood(state.snake);
  scoreEl.textContent = state.score;
  bestScoreEl.textContent = state.bestScore;
  overlay.classList.add("hidden");
};

const togglePause = () => {
  if (state.gameOver) return;
  state.paused = !state.paused;
  overlayTitle.textContent = "Paused";
  overlayMessage.textContent = "Press Space to resume.";
  overlay.classList.toggle("hidden", !state.paused);
};

const endGame = () => {
  state.gameOver = true;
  overlayTitle.textContent = "Game Over";
  overlayMessage.textContent = "Press Enter or tap Restart to play again.";
  overlay.classList.remove("hidden");
};

const updateDirection = (nextDirection) => {
  if (!nextDirection) return;
  const { x, y } = nextDirection;
  const { direction } = state;
  if (direction.x + x === 0 && direction.y + y === 0) {
    return;
  }
  state.queuedDirection = { x, y };
};

const step = () => {
  if (state.paused || state.gameOver) return;
  state.direction = state.queuedDirection;
  const head = state.snake[0];
  const next = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y,
  };

  if (next.x < 0 || next.x >= tileCount || next.y < 0 || next.y >= tileCount) {
    endGame();
    return;
  }

  if (state.snake.some((segment) => segment.x === next.x && segment.y === next.y)) {
    endGame();
    return;
  }

  state.snake.unshift(next);
  if (next.x === state.food.x && next.y === state.food.y) {
    state.score += 1;
    state.bestScore = Math.max(state.bestScore, state.score);
    saveBestScore(state.bestScore);
    state.food = placeFood(state.snake);
    scoreEl.textContent = state.score;
    bestScoreEl.textContent = state.bestScore;
  } else {
    state.snake.pop();
  }
};

const drawGrid = () => {
  context.fillStyle = "#0b1120";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(148, 163, 184, 0.1)";
  for (let i = 0; i <= tileCount; i += 1) {
    const position = i * gridSize;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, canvas.height);
    context.stroke();
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(canvas.width, position);
    context.stroke();
  }
};

const drawSnake = () => {
  state.snake.forEach((segment, index) => {
    context.fillStyle = index === 0 ? "#38bdf8" : "#22c55e";
    context.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );
  });
};

const drawFood = () => {
  context.fillStyle = "#f87171";
  context.beginPath();
  context.arc(
    state.food.x * gridSize + gridSize / 2,
    state.food.y * gridSize + gridSize / 2,
    gridSize / 2.4,
    0,
    Math.PI * 2
  );
  context.fill();
};

const gameLoop = (timestamp) => {
  if (!lastMoveTime) {
    lastMoveTime = timestamp;
  }
  if (timestamp - lastMoveTime >= speed) {
    step();
    lastMoveTime = timestamp;
  }

  drawGrid();
  drawFood();
  drawSnake();
  rafId = window.requestAnimationFrame(gameLoop);
};

const startLoop = () => {
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
  lastMoveTime = 0;
  rafId = window.requestAnimationFrame(gameLoop);
};

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
    return;
  }
  if (event.key === "Enter" && state.gameOver) {
    resetGame();
    startLoop();
    return;
  }
  updateDirection(directions[event.key]);
});

restartButton.addEventListener("click", () => {
  resetGame();
  startLoop();
});

resetGame();
startLoop();

const board = document.getElementById("board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startBtn = document.getElementById("startBtn");
const gameArea = document.querySelector(".game-area");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.2;

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

let currentPlayer = "X";
let playerX = "Player X", playerO = "Player O";
let cells = [];
let gameActive = true;

let scoreX = parseInt(localStorage.getItem("scoreX") || "0");
let scoreO = parseInt(localStorage.getItem("scoreO") || "0");

updateScoreUI();

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

startBtn.addEventListener("click", () => {
  playerX = playerXInput.value || "Player X";
  playerO = playerOInput.value || "Player O";
  document.querySelector(".name-inputs").classList.add("hidden");
  gameArea.classList.remove("hidden");
  status.textContent = `${playerX}'s turn`;
});

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleClick);
  board.appendChild(cell);
  cells.push(cell);
}

function handleClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (cell.textContent || !gameActive) return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
  clickSound.play();

  if (checkWin(currentPlayer)) {
    const winner = currentPlayer === "X" ? playerX : playerO;
    status.textContent = `🎉 ${winner} wins!`;
    gameActive = false;

    if (currentPlayer === "X") {
      scoreX++; localStorage.setItem("scoreX", scoreX);
    } else {
      scoreO++; localStorage.setItem("scoreO", scoreO);
    }
    updateScoreUI();
    return;
  }

  if (isDraw()) {
    status.textContent = "🤝 It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  const nextPlayer = currentPlayer === "X" ? playerX : playerO;
  status.textContent = `${nextPlayer}'s turn`;
}

function checkWin(player) {
  for (let combo of winningCombinations) {
    if (combo.every(i => cells[i].textContent === player)) {
      combo.forEach(i => cells[i].classList.add("winning-cell"));
      winSound.play();
      return true;
    }
  }
  return false;
}

function isDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function updateScoreUI() {
  scoreXEl.textContent = `X: ${scoreX}`;
  scoreOEl.textContent = `O: ${scoreO}`;
}

resetBtn.addEventListener("click", () => {
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });
  currentPlayer = "X";
  gameActive = true;
  status.textContent = `${playerX}'s turn`;
});

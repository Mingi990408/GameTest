const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      console.log(highScore);
      localStorage.setItem("highScore", highScore);
    }
    document.getElementById("high-score").textContent = `High Score: ${highScore}`;
}
  
// HTML에서 최고 점수 표시
// <div id="high-score">High Score: 0</div>

// 게임 종료 시 최고 점수 업데이트
if (checkGameOver()) {
    updateHighScore();
    alert("Game Over!");
}

// 초기화
function initGame() {
  addNewTile();
  addNewTile();
  renderBoard();
}

// 새로운 타일 추가
function addNewTile() {
  let emptyTiles = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) emptyTiles.push({ r, c });
    }
  }

  if (emptyTiles.length === 0) return;

  const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// 보드 렌더링
function renderBoard() {
  gameBoard.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (board[r][c] !== 0) {
        tile.classList.add(`tile-${board[r][c]}`);
        tile.textContent = board[r][c];
      }
      gameBoard.appendChild(tile);
    }
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

// 타일 이동 (좌우상하 키 입력)
function handleInput(event) {
  let moved = false;

  switch (event.key) {
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
  }

  if (moved) {
    addNewTile();
    renderBoard();
    if (checkGameOver()) {
      alert("Game Over!");
    }
  }
}

// 게임 오버 확인
function checkGameOver() {
  // 빈 칸이 있으면 게임 오버 아님
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
    }
  }

  // 인접한 타일이 같으면 게임 오버 아님
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r > 0 && board[r][c] === board[r - 1][c]) return false; // 위
      if (c > 0 && board[r][c] === board[r][c - 1]) return false; // 왼쪽
    }
  }

  return true;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      let row = board[r].filter((value) => value !== 0); // 0 제거
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2; // 병합
          score += row[i]; // 점수 추가
          row[i + 1] = 0; // 병합 후 값 제거
        }
      }
      row = row.filter((value) => value !== 0); // 병합 후 0 제거
      while (row.length < 4) row.push(0); // 빈 칸 채우기
      if (!arraysEqual(row, board[r])) moved = true;
      board[r] = row; // 업데이트
    }
    return moved;
  }
  
function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let row = board[r].filter((value) => value !== 0); // 0 제거
        for (let i = row.length - 1; i > 0; i--) {
        if (row[i] === row[i - 1]) {
            row[i] *= 2; // 병합
            score += row[i]; // 점수 추가
            row[i - 1] = 0; // 병합 후 값 제거
        }
        }
        row = row.filter((value) => value !== 0); // 병합 후 0 제거
        while (row.length < 4) row.unshift(0); // 빈 칸 채우기
        if (!arraysEqual(row, board[r])) moved = true;
        board[r] = row; // 업데이트
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        let column = [];
        for (let r = 0; r < 4; r++) column.push(board[r][c]);
        column = column.filter((value) => value !== 0); // 0 제거
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2; // 병합
                score += column[i]; // 점수 추가
                column[i + 1] = 0; // 병합 후 값 제거
            }
        }
        column = column.filter((value) => value !== 0); // 병합 후 0 제거
        while (column.length < 4) column.push(0); // 빈 칸 채우기
        for (let r = 0; r < 4; r++) {
        if (board[r][c] !== column[r]) moved = true;
        board[r][c] = column[r]; // 업데이트
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        let column = [];
        for (let r = 0; r < 4; r++) column.push(board[r][c]);
        column = column.filter((value) => value !== 0); // 0 제거
        for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
            column[i] *= 2; // 병합
            score += column[i]; // 점수 추가
            column[i - 1] = 0; // 병합 후 값 제거
        }
        }
        column = column.filter((value) => value !== 0); // 병합 후 0 제거
        while (column.length < 4) column.unshift(0); // 빈 칸 채우기
        for (let r = 0; r < 4; r++) {
        if (board[r][c] !== column[r]) moved = true;
        board[r][c] = column[r]; // 업데이트
        }
    }
    return moved;
}

// 두 배열 비교
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function renderBoard() {
    gameBoard.innerHTML = "";
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
        if (board[r][c] !== 0) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.classList.add(`tile-${board[r][c]}`);
            tile.textContent = board[r][c];
            tile.style.transform = `translate(${c * 110}px, ${r * 110}px)`;
            gameBoard.appendChild(tile);
        }
    }
}
scoreDisplay.textContent = `Score: ${score}`;
}
  
// 이벤트 리스너 등록
document.addEventListener("keydown", handleInput);

// 게임 시작
initGame();

let numSelected = null;
let difficulty = null;
let [second, minutes] = [0, 0];
let timer = null;
let PuzzleBoard, AnswerBoard, total_empty;
let error = 0;
window.onload = function() {
  setGame();
}
// Set up the board
function setGame() {
  if (!difficulty) {
    difficulty = document.querySelector(".easy");
    difficulty.classList.add("selected");
  }
  for (let i = 1; i <= 9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.querySelector(".digits").appendChild(number);
  }
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      let puzzle = document.createElement("div");
      puzzle.id = i.toString() + "-" + j.toString();
      if (i === 3 || i === 6) {
        puzzle.classList.add("horizontal-line");
      }

      if (j === 3 || j === 6) {
        puzzle.classList.add("vertical-line");
      }
      
      puzzle.addEventListener("click", selectPuzzle);
      puzzle.classList.add("puzzle");
      document.querySelector(".board").appendChild(puzzle);
    }
  }
  document.querySelector(".easy").addEventListener("click", () => {
    if (difficulty != null) {
      difficulty.classList.remove("selected");
    }
    difficulty = document.querySelector(".easy");
    difficulty.classList.add("selected");
  });
  
  document.querySelector(".medium").addEventListener("click", () => {
    if (difficulty != null) {
      difficulty.classList.remove("selected");
    };
    difficulty = document.querySelector(".medium");
    difficulty.classList.add("selected");
  });
  
  document.querySelector(".hard").addEventListener("click", () => {
    if (difficulty != null) {
      difficulty.classList.remove("selected");
    };
    difficulty = document.querySelector(".hard");
    difficulty.classList.add("selected");
  });

  document.querySelector(".new-game").addEventListener("click", () => { 
    PuzzleBoard = generatePuzzle();
    AnswerBoard = Copy(PuzzleBoard);
    total_empty = findEmpty(PuzzleBoard);
    Solution(0);
    BasedDiff(difficulty);
    reset();
    document.querySelector(".timer").innerText = `00:00`;
    watchStart();
    error = 0;
    document.querySelector(".errors").innerText = error;
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        let change = document.getElementById(`${i}-${j}`);
        change.classList.add("start-board");
        change.innerText = PuzzleBoard[i - 1][j - 1];
        if (Number(change.innerText) === 0) {
          change.innerText = ' ';
          change.classList.remove("start-board");
        }
      }
    }
  });
  
  document.querySelector(".solve").addEventListener("click", () => {
    clearInterval(timer);
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        let change = document.getElementById(`${i}-${j}`);
        change.innerText = AnswerBoard[i - 1][j - 1];
      }
    }
  });
}
function BasedDiff(difficulty) {
  let row, col;
  if (difficulty.className === "easy selected") {
    for (let i = 1; i <= 32; i++) {
      do {
        row = Number(Math.floor(Math.random() * 10 % 9));
        col = Number(Math.floor(Math.random() * 10 % 9));    
      } while ((PuzzleBoard[row][col] !== 0)); 
      PuzzleBoard[row][col] = AnswerBoard[row][col];
    }
  } else if (difficulty.className === "medium selected") {
    for (let i = 1; i <= 28; i++) {
      do {
        row = Number(Math.floor(Math.random() * 10 % 9));
        col = Number(Math.floor(Math.random() * 10 % 9));    
      } while ((PuzzleBoard[row][col] !== 0)); 
      PuzzleBoard[row][col] = AnswerBoard[row][col];
    }
  } else {
    for (let i = 1; i <= 24; i++) {
      do {
        row = Number(Math.floor(Math.random() * 10 % 9));
        col = Number(Math.floor(Math.random() * 10 % 9));    
      } while ((PuzzleBoard[row][col] !== 0)); 
      PuzzleBoard[row][col] = AnswerBoard[row][col];
    }
  }
}
function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("selected");
  }
  numSelected = this;
  numSelected.classList.add("selected");
}
function selectPuzzle() {
  if (numSelected) {
    if (!this.innerText) {
      let coords = this.id.split("-");
      let i = parseInt(coords[0]) - 1;
      let j = parseInt(coords[1]) - 1;
      console.log(AnswerBoard[i][j]);
      if (AnswerBoard[i][j] === Number(numSelected.id)) {
        this.innerText = numSelected.id;
      } else {
        error += 1;
        document.querySelector(".errors").innerText = error;
      }   
    }
    
  }
}
function watchStart() {
  if (timer !== null) {
    clearInterval(timer);
  }
  timer = setInterval(stopwatch, 1000);
}
function stopwatch() {
  second++;
  if (second == 60) {
    second = 0;
    minutes++;
  }
  if (minutes == 60) {
    minutes = 0;
  }
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = second < 10 ? "0" + second : second;
  document.querySelector(".timer").innerText = `${m}:${s}`;
}
function reset() {
  second = 0;
  minutes = 0;
}
// Game Algorithm's
function Copy(board) {
  let Answer= Array.from({length: 9}, () => Array(9).fill(0));
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      Answer[i][j] = board[i][j];
    }
  }
  return Answer;
}
function generatePuzzle() {
  let PuzzleBoard = Array.from({length: 9}, () => Array(9).fill(0));
  let row, col;
  for (let i = 1; i <= 9; i++) {
    do {
      row = Number(Math.floor(Math.random() * 10 % 9));
      col = Number(Math.floor(Math.random() * 10 % 9));    
    } while ((PuzzleBoard[row][col] !== 0)); 
    let input = Number(Math.floor(Math.random() * 10 % 9)) + 1;
    while (!SolvePuzzle(PuzzleBoard, row, col, input)) {
      if (LoopFalse(PuzzleBoard, row, col)) generatePuzzle();
      input = Number(Math.floor(Math.random() * 10 % 9)) + 1
    }
    PuzzleBoard[row][col] = input;
  }
  return PuzzleBoard;
}
function findEmpty(board) {
  let answer = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        answer.push({row: i, col: j});
      }
    }
  }
  return answer;
}
function SolvePuzzle(board, row, col, z) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === z || board[i][col] === z) {
      return false;
    }
  }
  for (let i = Math.floor(row / 3) * 3; i < Math.floor(row / 3) * 3 + 3; i++) {
    for (let j = Math.floor(col / 3) * 3; j < Math.floor(col / 3) * 3 + 3; j++) {
      if (board[i][j] === z) return false;
    }
  }
  return true;
} 
function Solution(Index) {
  if (Index >= total_empty.length) return true;
  for (let i = 1; i <= 9; i++) {
    const {row, col} = total_empty[Index];
    if (SolvePuzzle(AnswerBoard, row, col, i)) {
      AnswerBoard[row][col] = i;
      if (Solution(Index + 1)) return true;
    }
    AnswerBoard[row][col] = 0;
  }
  return false;
}
function LoopFalse(board, row, col) {
  for (let i = 1; i <= 9; i++) {
    if (SolvePuzzle(board, row, col, i)) return false;
  }
  return true;
}

var grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
var occupied = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


var start = 0;
var level = 1;
var prevMax = 2;
var emptySpaces = [];
//generate number between 1 and n inclusive
function generateRandomNumber(n) {
  return Math.floor(Math.random() * n) + 1;
}

//beginning
if (start == 0) {
  start++;
  $("html").on("keydown", startGame);
}

//generating 2 random tiles and then play the game
function startGame() {
  if (start == 1) {
    start++;
    flag = 1;
    generateRandomTile();
    generateRandomTile();
    updateBoard();
    playGame();
    if (start==9) {
      console.log("THIS IS THE END");
    }
    console.log("");
  }
  //play game
}
var emptyN=0;
//to generate a random tile
function generateRandomTile() {
  //check empty and generate
  checkEmpty();
  emptyN=emptySpaces.length;
  if (emptyN!=0) {
    var temp=generateRandomNumber(emptyN)-1;//random id index out of available spaces
    id=emptySpaces[temp];
    // console.log(id);
    var n = Math.pow(2, generateRandomNumber(level / 2));
    c=id%4;
    r=parseInt(id/4);
    // console.log(id+" r= "+r+" c= "+c);
    grid[r][c]=n;
    occupied[id]=n;
  }
  else {
    console.log("TESTING EMPTY SPACES");
    return;
  }
}

function checkEmpty() {
  emptySpaces=[];
  for (let id = 0; id < 16; id++) {
    var point = occupied[id];
    if (point==0) {
      emptySpaces.push(id);
    }
  }
}

function gameOver() {
  $("h3").text("GAME OVER");
  console.log("Is there any new move?");
  start=9;
}
//to update board
function updateBoard() {
  for (let i = 0; i < grid.length; i++) {
    const element = grid[i];
    for (let j = 0; j < grid.length; j++) {
      const num = element[j];
      var id = i * 4 + j + 1; //1 to 16
      occupied[id-1]=num;

      if (num) {
        var tile = $(".t" + id);
        tile.attr("class", "tile t" + id);
        tile.addClass("active");
        tile.addClass("n" + num);
        tile.text(num);
      } else {
        var tile = $(".t" + id);
        tile.removeClass("active");
        tile.text(" ");
        tile.attr("class", "tile t" + id);
      }
    }
  }
}

function playGame() {
  $("h3").text("Play using Arrow Keys");
  var moves=0;
  var tempGrid=grid;
  console.log(grid);
  $("html").on("keydown", function (e) {
    var pressedKey = e.key;
    if (pressedKey.includes("Arrow")) {
      switch (pressedKey) {
        case "ArrowUp":
          up(grid);
          break;
        case "ArrowDown":
          down(grid);
          break;
        case "ArrowRight":
          right(grid);
          break;
        case "ArrowLeft":
          left(grid);
          break;
        case "r": {
          start = 1;
          break;
        }
        default:
          break;
      }
      var count=countGrid();
      if (count<16) {
        moves++;
      }
      $("#moves").text(moves);
      generateRandomTile();
      updateBoard();
      // updateScore();
      if (start==9) {
        console.log("No more moves");
        return;
      }
    }
  });
}

function countGrid() {
  var count=0;
  for (let i = 0; i < occupied.length; i++) {
    const element = occupied[i];
    if (occupied[i]) {
      count++;
    }
  }
  return count;
}

function moveleft(grid) {
  for (let i = 0; i < grid.length; i++) {
    const element = grid[i];
    sortRows(element);
    compressLeft(element);
    sortRows(element);
  }
}

//FUNCTIONS FOR LEFT

function left(grid) {
  console.log("LEFT");
  moveleft(grid);
}
function sortRows(grid) {
  for (j = 0; j < 4; j++) {
    if (grid[j] != 0) {
      if (j != 0) {
        checkAndSwap(j, grid);
      }
    }
  }
}
function checkAndSwap(x, grid) {
  if (grid[x - 1] == 0) {
    swap(x, grid);
  }
  if (x != 1) {
    checkAndSwap(x - 1, grid);
  }
}

function swap(n, grid) {
  grid[n - 1] = grid[n];
  grid[n] = 0;
}

function compressLeft(a) {
  var maxPoint=0;
  for (let j = 0; j < a.length - 1; j++) {
    const x = a[j];
    if (x == a[j + 1] && x) {
      a[j] = a[j] * 2;
      a[j + 1] = 0;
      console.log("Merging");
      points=a[j]*2;
      maxPoint=maxPoint>points?maxPoint:points;
    }
  }
}

//FUNCTIONS FOR UP

function up(grid) {
  console.log("UP");
  var transGrid = transpose(grid);
  moveleft(transGrid);
  grid = transpose(transGrid);
}

function transpose(mat) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < i; j++) {
      const tmp = mat[i][j];
      mat[i][j] = mat[j][i];
      mat[j][i] = tmp;
    }
  }
  return mat;
}

//Functions for right

function right(grid) {
  console.log("RIGHT");
  var oppGrid = rev(grid);
  moveleft(oppGrid);
  grid = rev(oppGrid);
}
function rev(mat) {
  for (let i = 0; i < mat.length; i++) {
    mat[i] = mat[i].reverse();
  }
  return mat;
}

//functions for down

function down(grid) {
  console.log("Down");
  var downGrid = rev(transpose(grid));
  moveleft(downGrid);
  grid = transpose(rev(downGrid));
}

//UPDATE Score
var moves = 0;
var score = 0;
function updateScore() {
  if (flag==1) {
    moves++;
    //maximum
    var maximum = maxGrid();
    score += points;
  
    if (prevMax < maximum) {
      level++;
      prevMax = maximum;
    }
    
    $("h3").text("Level " + level);
    $("#score").text(score);
    $("#moves").text(moves);
  }
  else{
    var finalScore=score;
    console.log("FINAL UPDATE DONE");
    // $("h3").text("Level " + level);
  }
}

function maxGrid() {
  var max = 0;
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const element = row[j];
      max = element > max ? element : max;
    }
  }
  return max;
}

//Link the canvas and start button, set defaults
var canvas = document.getElementById("matchit");
var resetButton = document.getElementById("gameReset");
var context = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
var grid = new Array(4);
grid[0] = new Array(4);
grid[1] = new Array(4);
grid[2] = new Array(4);
grid[3] = new Array(4);
var loaded;
context.font = "3em sans-serif";
context.textAlign = "center";
  
//load in images
const NUMIMGS = 9;
var imageCount = 0;
var cover = new Image();
cover.onload = function() {
  imageCount++;
}
cover.src="images/matchit.png";
var sun = new Image();
sun.onload = function() {
  imageCount++;
}
sun.src="images/sun.png";
var stars = new Image();
stars.onload = function() {
  imageCount++;
}
stars.src="images/stars.png";
var apple = new Image();
apple.onload = function() {
  imageCount++;
}
apple.src="images/apple.png";
var lemon = new Image();
lemon.onload = function() {
  imageCount++
}
lemon.src="images/lemon.png";
var snake = new Image();
snake.onload = function() {
  imageCount++
}
snake.src="images/snake.png";
var cat = new Image();
cat.onload = function() {
  imageCount++
}
cat.src="images/cat.png";
var sock = new Image();
cover.onload = function() {
  imageCount++
}
sock.src="images/sock.png";
var hat = new Image();
hat.onload = function() {
  imageCount++
}
hat.src="images/hat.png";
if (imageCount == NUMIMGS) {
  loaded = true;
}

//generic draw function
function draw(context, img, x, y) {
  context.drawImage(img,x,y); 
}

//tiles the canvas with the cover image
function fillBoard(context, grid) {
  for (var i=0; i<grid.length; i++) {
    for (var j=0; j<grid[i].length; j++) {
	  draw(context, cover, j*64, i*64);
    }
  }
}

//checks how many copies of an image are on the board
function pairMatch(imgIndex, board) {
  count = 0;
  for (var i=0; i<board.length; i++) {
	for (var j=0; j<board.length; j++) {
	  if (board[i][j] == imgIndex) {
		count++;
	  }
	}
  }
  return count;
}

//randomly assigns image placement to the board
function getBoard(context, grid) {
  board = new Array(4);
  board[0] = new Array(4);
  board[1] = new Array(4);
  board[2] = new Array(4);
  board[3] = new Array(4);
  for (var i=0; i<grid.length; i++) {
    for (var j=0; j<grid.length; j++) {	
	  do {
	    var imgIndex = Math.floor(Math.random()*8);
		//ensures 2 copies of each image
	  } while (pairMatch(imgIndex, board) >= 2);
	  board[i][j] = imgIndex	        
	}
  }
  play(board, context);
}

//gets click coordinates
function mousePos(evt) {
  var boundary = canvas.getBoundingClientRect();
  var offsetX = boundary.left;
  var offsetY = boundary.top;
  var w = (boundary.width - canvas.width)/2;
  var h = (boundary.height - canvas.height)/2;
  offsetX += w;
  offsetY += h;
  var mx = Math.round(evt.clientX - offsetX);
  var my = Math.round(evt.clientY - offsetY);
  return {x: mx, y: my};
}

//converts click coordinates into tile reference
function getClick(x, y) { 
  if (x < 0) { x = 0; }
  if (x >= WIDTH) { x = WIDTH - 1; }
  if (y < 0) { y = 0; }
  if (y >= HEIGHT) { y = HEIGHT - 1; }
  var gy = Math.floor(y/64);
  var gx = Math.floor(x/64);
  return {j: gx, i: gy};
}

//clicking on a tile reveals the image
function flipTile(evt, board, context) {
  var pos = mousePos(evt);
  var x = pos.x;
  var y = pos.y;
  var cell = getClick(x, y)
  var i = cell.i;
  var j = cell.j;
  var imgIndex = board[i][j];
  clickedCell.push({ imgIndex, i, j });
  clickCount++;
  var clicked;
  switch (imgIndex) {
	case 0:
	  clicked = sun;
	  break;
	case 1:
	  clicked = stars;
	  break;		  
	case 2:
	  clicked = apple;
	  break;
	case 3:
	  clicked = lemon
	  break;
	case 4:
	  clicked = snake
	  break;
	case 5:
	  clicked = cat
	  break;
	case 6:
	  clicked = sock
	  break;
	case 7:	
	  clicked = hat
	  break;
  }
  draw(context, clicked, j*64, i*64);
  if (clickCount % 2 == 0) {
	//when 2 tiles are revealed, show them for 2 seconds before hiding
	var timeOut = window.setTimeout(clearCells, 2000, context, clickedCell, clickCount);
  }  
}

//hide non-matching tiles
function clearCells(context, clickedCell, clickCount) {
  var cell1 = clickedCell[clickCount - 2];
  var cell2 = clickedCell[clickCount - 1];
  var x1 = cell1.j * 64;
  var x2 = cell2.j * 64;
  var y1 = cell1.i * 64;
  var y2 = cell2.i * 64;
  if (cell1.imgIndex != cell2.imgIndex) {
	draw(context, cover, x1, y1);
	draw(context, cover, x2, y2);
  }
  else {
	completed++;
  }  
  if (completed == 8) {
	victory(context, clickCount);
  }
}

//displays win message and resets game info
function victory(context, clickCount) {
  var message = "Turns: " + clickCount/2;
  context.fillText("Victory!", 127.5, 128);
  context.fillText(message, 127.5, 196);
  clickedCell = new Array();
  clickCount = 0;
  completed = 0;
}

function play(board, context) {
  clickedCell = new Array();
  clickCount = 0;
  completed = 0;
}

//loads new board
function start(context, grid) {
  fillBoard(context, grid);
  getBoard(context, grid);
}

//wait for the user to click before running game
resetButton.addEventListener("click", function() { start(context, grid); }, false);
canvas.addEventListener("click", function(evt) { flipTile(evt, board, context); }, false);
//before user clicks start, show large cover image
context.drawImage(cover, 0, 0, 256, 256);
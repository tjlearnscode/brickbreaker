import { brickCoords } from "./brickCoords.js";
import { otherSpriteCoords } from "./otherSpriteCoords.js";
const spriteSheet = new Image();
spriteSheet.src = 'Breakout_Tile_Free.png';
const starryBG = new Image();
starryBG.src = 'starryBG.png';
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasHeight = canvas.height = 800;
const canvasWidth = canvas.width = 1200;
const brickWidth = 100;
const brickHeight = 50;
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let moveLeftButton = document.getElementById("moveLeft");
let moveRightButton = document.getElementById("moveRight");



//CONTROLLER EVENTS
let startX = 0;
document.addEventListener('keydown', (event) => {player.handlePlayerKeyInput(event.key)});
document.addEventListener('touchstart', event => {player.handleTouchStart(event)});
document.addEventListener('touchmove', event => {player.handleTouchMove(event)});
document.addEventListener('mousemove', event => {player.handleMouseMove(event)});

//SOUND EFFECTS AND MUSIC
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = .2;
canvas.addEventListener('DOMContentLoaded', backgroundMusic.play());

const paddleCollisionSoundEffect = document.getElementById('paddleCollisionSoundEffect');
const brickCollisionSoundEffect = document.getElementById('brickCollisionSoundEffect');
const muteButton = document.getElementById('muteButton');


class Player {
  constructor(x, y) {
    this.xOrigin = 520;
    this.yOrigin = 750;
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 25;
    this.speed = 125;
    this.imgReps = 0;
    this.imgNum = 1;
    this.paddleType = 'laserPaddle';
    this.imgCoords = otherSpriteCoords.filter((item) => item.name == this.paddleType + this.imgNum)[0];
  }

  //Handle player input for touchscreen
  handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    console.log(startX);
  };

  handleTouchMove(event) {
    const touch = event.touches[0];
    const currentX = touch.clientX;
    const distanceX = currentX - startX;
    this.x += distanceX;
    startX = currentX;
  };

  //Handle player input for mouse movement
  handleMouseMove(event) {
    this.x += event.movementX;
}

  // Handle player input (e.g., keyboard, gamepad)
  handlePlayerKeyInput(key) {
    switch(key) {
      case 'ArrowLeft': this.x -= this.speed;
        break;
      case 'ArrowRight': this.x += this.speed;
        break;
      default: {};
};
  }

  update() {
    this.imgReps ++;
    if(this.imgReps / 4 === 1) {
      this.imgReps = 0;
      if(this.imgNum === 3) {
      this.imgNum = 1;
    } else {
      this.imgNum ++;
    };
    this.imgCoords = otherSpriteCoords.filter((item) => item.name == this.paddleType + this.imgNum)[0];
  };

    // Keep player within game boundaries
    this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
  }
  draw(ctx) {
    // Draw the player on the canvas
    ctx.drawImage(spriteSheet, this.imgCoords.sx, this.imgCoords.sy, this.imgCoords.sw, this.imgCoords.sh, this.x, this.y, this.width, this.height)
  }
  
}

class Brick {
  constructor(color, row, col){
    this.colorClass = color,
    this.brick = brickCoords[color],
    this.wholeCoords = this.brick[0],
    this.crackedCoords = this.brick[1],
    this.strength = 2,
    this.hits = 0,
    this.width = brickWidth,
    this.height = brickHeight,
    this.destinationX = brickWidth * col,
    this.destinationY = brickHeight * row
  }
  breakable() { 
    if (this.colorClass == 'greys') {
      return true;
    } else {
      return false;
    }
  }

  currentState() {
    if(this.strength === 2) {
      return this.wholeCoords;
    } else {
      return this.crackedCoords;
    }
  }
}

let bricksArr = [];

for(let i = 0; i < 5; i++) {
  for(let j = 0; j < 12; j++) {
    const brick = new Brick ('blues', i, j);
    bricksArr.push(brick);
  }
}

function drawBrick(brick) {
  ctx.drawImage(spriteSheet, brick.currentState().sx, brick.currentState().sy, brick.currentState().sw, brick.currentState().sh, brick.destinationX, brick.destinationY, brick.width, brick.height);
}

function drawAllBricks(arr) {
  for(const brick of arr) {
    drawBrick(brick);
  }
}

function drawBackground(img) {
  ctx.drawImage(img, 0, 0,canvasWidth,canvasHeight);
}


const player = new Player(520, 750);

class Ball {
  constructor() {
  this.ballCoords = {
    "name": "ball",
    "sx": "1403",
    "sy": "652",
    "sw": "64",
    "sh": "64"
  },
  this.width = 25,
  this.height = 25,
  this.radus = 12.5,
  this.xOrigin = player.xOrigin + ((player.width-this.width) / 2),
  this.yOrigin = player.yOrigin - this.height,
  this.x = this.xOrigin,
  this.y = this.yOrigin,
  this.dx = 5,
  this.dy = -5
}

  update() {
    this.x += this.dx;
    this.y += this.dy;
    if(this.x + this.width >= canvasWidth) {
      this.dx = -this.dx;
    } else if (this.x <= 0) {
      this.dx = -this.dx;
    }

    if (this.y <= 0) {
      this.dy = -this.dy;
    } else if (this.y + this.height >= canvasHeight) {
      this.dy = -this.dy;
    }
  }  

  draw(ctx) {
    ctx.drawImage(spriteSheet, this.ballCoords.sx, this.ballCoords.sy, this.ballCoords.sw, this.ballCoords.sh, this.x, this.y, this.width, this.height);
  }
}


let ball = new Ball;

function checkBrickCollision() {
  //   const bricksleftRight = bricksArr.filter((brick) => brick.destinationX >= ball.x - 100 & brick.destinationX <= ball.x + 100 );
  //   const bricksAboveBelow = bricksleftRight.filter((brick) => brick.destinationY >= ball.y - 100 && brick.destinationY <= ball.y + 100);
  //   console.log(bricksAboveBelow);
  //   for(let i = 0; i < bricksAboveBelow.length; i++) {
  //     const bricksArrayIndex = bricksArr.findIndex((b) => b.destinationX == bricksAboveBelow[i].destinationX & b.destinationY == bricksAboveBelow[i].destinationY);
  //     console.log(bricksArrayIndex);
  //     if (ball.x >= bricksAboveBelow[i].destinationX & ball.x + ball.width <= bricksAboveBelow[i].destinationX+ bricksAboveBelow[i].width) {
  //       if (ball.y >= bricksAboveBelow[i].destinationY & ball.y + ball.height <= bricksAboveBelow[i].destinationY + bricksAboveBelow[i].height) {
  //         ball.dy = -ball.dy;
  //         bricksAboveBelow[i].destinationY = -bricksAboveBelow[i].destinationY;
  //         bricksAboveBelow[i].strength --;
  //         bricksArr[bricksArrayIndex] = bricksAboveBelow[i];

  //       }
  //     }
  // }

  for(let i = 0; i < bricksArr.length; i++) {
      if (ball.x >= bricksArr[i].destinationX & ball.x + ball.width <= bricksArr[i].destinationX+ bricksArr[i].width) {
        if (ball.y >= bricksArr[i].destinationY & ball.y + ball.height <= bricksArr[i].destinationY + bricksArr[i].height) {
          ball.dy = -ball.dy;
          bricksArr[i].destinationY = -bricksArr[i].destinationY;
          bricksArr[i].strength --;
          bricksArr[i] = bricksArr[i];
          }
        }
    }
}  


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawBackground(starryBG);
  player.update();
  player.draw(ctx);
  drawAllBricks(bricksArr);
  checkBrickCollision();
  ball.update();
  ball.draw(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop(); 



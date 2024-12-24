import { brickCoords } from "./brickCoords.js";
import { otherSpriteCoords } from "./otherSpriteCoords.js";
import {levels} from "./levels.js";
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
let brickCount = 0;
let points =0;
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let moveLeftButton = document.getElementById("moveLeft");
let moveRightButton = document.getElementById("moveRight");
let pointsContainer = document.getElementById("points");
let levelNumber = 2;
let level = levels.filter((e) => e.levelNumber === levelNumber)[0];


//CONTROLLER EVENTS
let startX = 0;
document.addEventListener('keydown', (event) => {player.handlePlayerKeyInput(event.key)});
document.addEventListener('touchstart', event => {player.handleTouchStart(event)});
document.addEventListener('touchmove', event => {player.handleTouchMove(event)});
document.addEventListener('mousemove', event => {player.handleMouseMove(event)});
canvas.addEventListener('click', startBall);
canvas.addEventListener('touchStart', startBall);
document.addEventListener('keydown', (event) => {console.log(event.key);if (event.key == "Enter") {
  startBall()
}
});

//SOUND EFFECTS AND MUSIC
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = .2;
const paddleCollisionSoundEffect = document.getElementById('paddleCollisionSoundEffect');
const brickCollisionSoundEffect = document.getElementById('brickCollisionSoundEffect');
const muteButton = document.getElementById('muteButton');

//START BUTTON
document.getElementById('start').addEventListener('click', gameLoop);


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

  reset() {
    this.x = this.xOrigin;
    this.y= this.yOrigin;
  }


  draw(ctx) {
    // Draw the player on the canvas
    ctx.drawImage(spriteSheet, this.imgCoords.sx, this.imgCoords.sy, this.imgCoords.sw, this.imgCoords.sh, this.x, this.y, this.width, this.height)
  }
  
}

let player = new Player(520, 750);

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
    const brick = new Brick (level.brickColor, i, j);
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
  this.radius = 12.5,
  this.xOrigin = player.xOrigin + ((player.width-this.width) / 2),
  this.yOrigin = player.yOrigin - this.height,
  this.x = this.xOrigin,
  this.y = this.yOrigin,
  this.centerX = this.x + this.radius,
  this.centerY = this.y + this.radius,
  this.dx = 7,
  this.dy = -7,
  this.moving = false;
  this.ms = 0;
}

  update() {
    if(this.x + this.width >= canvasWidth) {
      this.dx = -this.dx;
    } else if (this.x <= 0) {
      this.dx = -this.dx;
    }

    if (this.y <= 0) {
      this.dy = -this.dy;
    } else if (this.y + this.height >= canvasHeight) {
      reset();
    }

    if (this.moving) {
      this.x += this.dx;
      this.y += this.dy;
      this.ms += 1;
    } else {
      this.x = player.x + (player.width/2 - this.radius);
    }
  }

  draw(ctx) {
    ctx.drawImage(spriteSheet, this.ballCoords.sx, this.ballCoords.sy, this.ballCoords.sw, this.ballCoords.sh, this.x, this.y, this.width, this.height);
  }
}


let ball = new Ball;

function checkBrickCollision() {

    if (ball.ms > 5){
      if (ball.x + ball.radius >= player.x && ball.x + ball.radius <= player.x + player.width && ball.y + ball.height === player.y) {
    ball.dy = -ball.dy;
    paddleCollisionSoundEffect.play();
      } else {};
  } else {};


  for(let i = 0; i < bricksArr.length; i++) {
      if (ball.x + ball.radius >= bricksArr[i].destinationX & ball.x + ball.radius <= bricksArr[i].destinationX + bricksArr[i].width) {
        if (ball.y + ball.height >= bricksArr[i].destinationY & ball.y <= bricksArr[i].destinationY + bricksArr[i].height) {
          if (bricksArr[i].strength === 1) {
            bricksArr.splice(i, 1);
          } else {
            bricksArr[i].strength --;
          }
          brickCollisionSoundEffect.play();
          points += 2;
          pointsContainer.innerText = "Points: " + points;
          countBricks();
          ball.dy = -ball.dy;
          }
        } else if (ball.y + ball.radius >= bricksArr[i].destinationY & ball.y + ball.radius <= bricksArr[i].destinationY + bricksArr[i].height) {
          if (ball.x + ball.width >= bricksArr[i].destinationX & ball.x <= bricksArr[i].destinationX + bricksArr[i].width) {
            if (bricksArr[i].strength === 1) {
              bricksArr.splice(i, 1)
            } else {
              bricksArr[i].strength --;
            }
            brickCollisionSoundEffect.play();
            countBricks();
            ball.dx = -ball.dx;
            }
          }
    }
}


function reset() {
  // ball.moving = false;
  // ball.x = ball.xOrigin;
  // ball.y = ball.yOrigin;
  // ball.dx = 7;
  // ball.dy = -7;
  ball = new Ball;
  player.x = player.xOrigin;
  player.y = player.yOrigin;
}

function startBall() {
  ball.moving = true;
  }


function countBricks() {
  brickCount = bricksArr.length;
  console.log(brickCount);
}

class Laser {
  constructor(playerX, playerW, playerY ) {
    this.x = playerX,
    this.y = playerY,
    this.sx = 0,
    this.sy = 990,
    this.sw = 10,
    this.sh = 21,
    this.laserOn = true
  }

  draw() {
    ctx.drawImage(spriteSheet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, 10, 21)
  }
  
  update() {
    if(this.laserOn) {
      if(this.y === player.y) {
        this.y -= 10;
      } else {
        this.y -= 10
      }
  } else {}
}
}

let laser1 = new Laser(player.x, player.width, player.y);

function gameLoop() {
  backgroundMusic.play();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawBackground(starryBG);
  player.update();
  player.draw(ctx);
  checkBrickCollision();
  drawAllBricks(bricksArr);
  laser1.update();
  laser1.draw();
  ball.update();
  ball.draw(ctx);
  requestAnimationFrame(gameLoop);
}




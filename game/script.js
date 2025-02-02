import { brickCoords } from "./brickCoords.js";
import { otherSpriteCoords } from "./otherSpriteCoords.js";
import { levels } from "./levels.js";
const spriteSheet = new Image();
spriteSheet.src = "Breakout_Tile_Free.png";
const starryBG = new Image();
starryBG.src = "starryBG.png";
const bossImg = new Image();
bossImg.src = "boss.png";
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasHeight = (canvas.height = 800);
const canvasWidth = (canvas.width = 1200);
const brickWidth = 120;
const brickHeight = 50;
let brickCount = 0;
let points = 0;
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let moveLeftButton = document.getElementById("moveLeft");
let moveRightButton = document.getElementById("moveRight");
let pointsContainer = document.getElementById("points");
let levelNumber = 3;
let level = levels.find((e) => e.levelNumber === levelNumber);
let lasers = [];
let ctrlKeyDown = false;
let isRunning = false;

//CONTROLLER EVENTS
let startX = 0;
document.addEventListener("keyup", (event) => {
  if (event.key === "Control") {
    ctrlKeyDown = false;
    console.log(ctrlKeyDown);
  } else {
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Control") {
    ctrlKeyDown = true;
  } else if (event.key === "Enter") {
    ball.moving = true;
    console.log(ball);
  } else {
  }
  player.handleKeyInput(event.key);
  ball.handleKeyInput(event.key);
});
document.addEventListener("touchstart", (event) => {
  player.handleTouchStart(event);
});
document.addEventListener("touchmove", (event) => {
  player.handleTouchMove(event);
});
document.addEventListener("mousemove", (event) => {
  player.handleMouseMove(event);
});
canvas.addEventListener("click", startBall);
canvas.addEventListener("touchStart", startBall);

//SOUND EFFECTS AND MUSIC
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.1;
const paddleCollisionSoundEffect = document.getElementById(
  "paddleCollisionSoundEffect"
);
const brickCollisionSoundEffect = document.getElementById(
  "brickCollisionSoundEffect"
);
const muteButton = document.getElementById("muteButton");

//START BUTTON
document.getElementById("start").addEventListener("click", () => {
  isRunning = !isRunning;
  disableStart();
  gameLoop();
});
document.getElementById("pause").addEventListener("click", pause);

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
    this.paddleType = "laserPaddle";
    this.imgCoords = otherSpriteCoords.filter(
      (item) => item.name == this.paddleType + this.imgNum
    )[0];
  }

  //Handle player input for touchscreen
  handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    console.log(startX);
  }

  handleTouchMove(event) {
    const touch = event.touches[0];
    const currentX = touch.clientX;
    const distanceX = currentX - startX;
    this.x += distanceX;
    startX = currentX;
  }

  //Handle player input for mouse movement
  handleMouseMove(event) {
    this.x += event.movementX;
  }

  // Handle player input (e.g., keyboard, gamepad)
  handleKeyInput(key) {
    if (ctrlKeyDown) {
      //do nothing if control key is down as it will be engaging the movement of the ball pointer
    } else {
      switch (key) {
        case "ArrowLeft":
          this.x -= this.speed;
          break;
        case "ArrowRight":
          this.x += this.speed;
          break;
        default: {
        }
      }
    }
  }

  update() {
    this.imgReps++;
    if (this.imgReps / 4 === 1) {
      this.imgReps = 0;
      if (this.imgNum === 3) {
        this.imgNum = 1;
      } else {
        this.imgNum++;
      }
      this.imgCoords = otherSpriteCoords.filter(
        (item) => item.name == this.paddleType + this.imgNum
      )[0];
    }

    // Keep player within game boundaries
    this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
  }

  reset() {
    this.x = this.xOrigin;
    this.y = this.yOrigin;
  }

  draw(ctx) {
    // Draw the player on the canvas
    ctx.drawImage(
      spriteSheet,
      this.imgCoords.sx,
      this.imgCoords.sy,
      this.imgCoords.sw,
      this.imgCoords.sh,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let player = new Player(520, 750);

class Brick {
  constructor(color, row, col) {
    (this.colorClass = color),
      (this.brick = brickCoords[color]),
      (this.wholeCoords = this.brick[0]),
      (this.crackedCoords = this.brick[1]),
      (this.strength = 2),
      (this.hits = 0),
      (this.width = brickWidth),
      (this.height = brickHeight),
      (this.destinationX = brickWidth * col),
      (this.destinationY = brickHeight * row);
  }
  breakable() {
    if (this.colorClass == "greys") {
      return true;
    } else {
      return false;
    }
  }

  currentState() {
    if (this.strength === 2) {
      return this.wholeCoords;
    } else {
      return this.crackedCoords;
    }
  }
}

let bricksArr = [];

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 10; j++) {
    if (level.greyIndexes.includes(i * 10 + j)) {
      const brick = new Brick("greys", i, j);
      bricksArr.push(brick);
    } else {
      const brick = new Brick(level.brickColor, i, j);
      bricksArr.push(brick);
    }
  }
}

function drawBrick(brick) {
  ctx.drawImage(
    spriteSheet,
    brick.currentState().sx,
    brick.currentState().sy,
    brick.currentState().sw,
    brick.currentState().sh,
    brick.destinationX,
    brick.destinationY,
    brick.width,
    brick.height
  );
}

function drawAllBricks(arr) {
  for (const brick of arr) {
    drawBrick(brick);
  }
}

function drawBackground(img) {
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}

class Ball {
  constructor() {
    (this.ballCoords = {
      name: "ball",
      sx: "1403",
      sy: "652",
      sw: "64",
      sh: "64",
    }),
      (this.width = 25),
      (this.height = 25),
      (this.radius = 12.5),
      (this.xOrigin = player.xOrigin + (player.width - this.width) / 2),
      (this.yOrigin = player.yOrigin - this.height - 1),
      (this.x = this.xOrigin),
      (this.y = this.yOrigin),
      (this.centerX = this.x + this.radius),
      (this.centerY = this.y + this.radius),
      (this.dx = 10),
      (this.dy = -10),
      (this.moving = false),
      (this.xDirection = "straight"),
      (this.ms = 0),
      (this.pointerPosIndex = 2),
      (this.pointerX = this.x + this.radius),
      (this.pointerY = this.y + this.radius),
      (this.pointerXEnd = this.pointerX),
      (this.pointerYEnd = this.pointerY - 50),
      (this.strokeColor = "rgba(243, 247, 246, 1)");
  }
  handleKeyInput(key) {
    if (ctrlKeyDown) {
      if (key === "ArrowRight" && this.pointerPosIndex < 3) {
        this.pointerPosIndex++;
      } else if (key === "ArrowLeft" && this.pointerPosIndex > 1) {
        this.pointerPosIndex--;
      } else {
      }
    }
  }
  update() {
    if (this.x + this.width >= canvasWidth) {
      this.dx = -this.dx;
      this.xDirection = "left";
    } else if (this.x <= 0) {
      this.dx = -this.dx;
      this.xDirection = "right";
    }

    if (this.y <= 0) {
      this.dy = -this.dy;
    } else if (this.y + this.height >= canvasHeight) {
      reset();
    }

    if (this.moving) {
      this.x += this.dx;
      this.y += this.dy;
      this.strokeColor = "rgba(243, 247, 246, 0)";
    } else {
      this.x = player.x + (player.width / 2 - this.radius);
      this.strokeColor = "rgba(243, 247, 246, 1)";
      switch (this.pointerPosIndex) {
        case 1:
          this.pointerXEnd = ball.x + ball.radius - 28;
          this.pointerYEnd = ball.y - 28;
          this.dx = -10;
          this.dy = -10;
          this.xDirection = "left";
          break;
        case 2:
          this.pointerXEnd = ball.x + ball.radius;
          this.pointerYEnd = ball.y - 28;
          this.dx = 0;
          this.dy = -10;
          this.xDirection = "straight";
          break;
        case 3:
          this.pointerXEnd = ball.x + ball.radius + 28;
          this.pointerYEnd = ball.y - 28;
          this.dx = 10;
          this.dy = -10;
          this.xDirection = "right";
          break;
        default:
          this.pointerXEnd = ball.x + ball.radius;
          this.pointerYEnd = ball.y - 28;
          this.dx = 0;
          this.dy = -10;
          this.xDirection = "straight";
      }
      this.pointerX = this.x + this.radius;
      this.pointerY = this.y + this.radius;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pointerX, this.pointerY);
    ctx.lineTo(this.pointerXEnd, this.pointerYEnd);
    ctx.strokeStyle = this.strokeColor;
    ctx.closePath();
    ctx.stroke();
    ctx.drawImage(
      spriteSheet,
      this.ballCoords.sx,
      this.ballCoords.sy,
      this.ballCoords.sw,
      this.ballCoords.sh,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let ball = new Ball();

function checkBrickCollision() {
  if (
    ball.x + ball.radius >= player.x &&
    ball.x + ball.radius <= player.x + player.width &&
    ball.y + ball.height === player.y + 9
  ) {
    if (ball.xDirection == "right") {
      if (ball.x + ball.radius < player.x + 50) {
        ball.dx = -ball.dx;
      } else {
      }
    } else if (ball.xDirection == "left") {
      if (ball.x + ball.radius > player.x + 100) {
        ball.dx = -ball.dx;
      } else {
      }
    } else {
      if (ball.x + ball.radius < player.x + 50) {
        ball.dx = -10;
        ball.xDirection = "left";
      } else if (ball.x + ball.radius > player.x + 50) {
        ball.dx = 10;
        ball.xDirection = "right";
      } else {
      }
    }
    ball.dy = -ball.dy;
    paddleCollisionSoundEffect.play();
  } else {
  }

  for (let i = 0; i < bricksArr.length; i++) {
    if (
      (ball.x + ball.radius >= bricksArr[i].destinationX) &
      (ball.x + ball.radius <= bricksArr[i].destinationX + bricksArr[i].width)
    ) {
      if (
        (ball.y + ball.height >= bricksArr[i].destinationY) &
        (ball.y <= bricksArr[i].destinationY + bricksArr[i].height)
      ) {
        if (bricksArr[i].colorClass === "greys") {
          //add grey brick collission sound
        } else {
          if (bricksArr[i].strength === 1) {
            bricksArr.splice(i, 1);
            if (bricksArr.length === 0) {
              boss1.active = true;
            }
          } else {
            bricksArr[i].strength--;
          }
          brickCollisionSoundEffect.load();
          brickCollisionSoundEffect.play();
          points += 2;
          if (Number.isInteger(points / 50)) {
            lasers.push(new Laser(player.x, player.width, player.y));
          }
          pointsContainer.innerText = "Points: " + points;
          countBricks();
        }

        ball.dy = -ball.dy;
      }
    } else if (
      (ball.y + ball.radius >= bricksArr[i].destinationY) &
      (ball.y + ball.radius <= bricksArr[i].destinationY + bricksArr[i].height)
    ) {
      if (
        (ball.x + ball.width >= bricksArr[i].destinationX) &
        (ball.x <= bricksArr[i].destinationX + bricksArr[i].width)
      ) {
        if (bricksArr[i].colorClass === "greys") {
          // add grey brick collission sound effect
        } else {
          if (bricksArr[i].strength === 1) {
            bricksArr.splice(i, 1);
            if (bricksArr.length === 0) {
              boss1.active = true;
            }
          } else {
            bricksArr[i].strength--;
          }
          brickCollisionSoundEffect.load();
          brickCollisionSoundEffect.play();
          points += 2;
          if (Number.isInteger(points / 50)) {
            lasers.push(new Laser(player.x, player.width, player.y));
          }
          pointsContainer.innerText = "Points: " + points;
          countBricks();
        }

        ball.dx = -ball.dx;
        if (ball.xDirection == "right") {
          ball.xDirection = "left";
        } else if (ball.xDirection == "left") {
          ball.xDirection = "right";
        } else {
        }
      }
    }
  }
}

function checkBossCollision() {
  if (
    (ball.x + ball.radius >= boss1.x) &
    (ball.x + ball.radius <= boss1.x + boss1.width)
  ) {
    if ((ball.y + ball.height >= 0) & (ball.y <= boss1.height)) {
      boss1.strength--;
      brickCollisionSoundEffect.play();
      points += 2;
      pointsContainer.innerText = "Points: " + points;
      ball.dy = -ball.dy;
    }
  } else if (
    (ball.y + ball.radius >= 0) &
    (ball.y + ball.radius <= boss1.height)
  ) {
    if ((ball.x + ball.width >= boss1.x) & (ball.x <= boss1.x + boss1.width)) {
      boss1.strength--;
      brickCollisionSoundEffect.play();
      points += 2;
      pointsContainer.innerText = "Points: " + points;
      boss1.dx = -boss1.dx;
      ball.dx = -ball.dx;
    }
  }
}

function pause() {
  isRunning = !isRunning;
}

function reset() {
  ball.moving = false;
  ball.x = ball.xOrigin;
  ball.y = ball.yOrigin;
  ball.dx = 0;
  ball.dy = 0;
  player.x = player.xOrigin;
  player.y = player.yOrigin;
}

function startBall() {
  ball.moving = true;
}

function countBricks() {
  brickCount = bricksArr.length;
}

class Laser {
  constructor(playerX, playerW, playerY) {
    (this.x = playerX),
      (this.y = playerY),
      (this.sx = 0),
      (this.sy = 990),
      (this.sw = 10),
      (this.sh = 21),
      (this.laserOn = true);
  }

  draw() {
    ctx.drawImage(
      spriteSheet,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x,
      this.y,
      10,
      21
    );
  }

  update() {
    if (this.laserOn) {
      if (this.y === player.y) {
        this.y -= 10;
      } else {
        this.y -= 10;
      }
      this.draw();
    } else {
    }
  }
}

let laser1 = new Laser(player.x, player.width, player.y);

function disableStart() {
  document.getElementById("start").disabled = true;
}

class Boss {
  constructor() {
    (this.xOrigin = 400),
      (this.yOrigin = 0),
      (this.x = 400),
      (this.width = 400),
      (this.height = 150),
      (this.dx = 5),
      (this.strength = 3),
      (this.active = false);
  }

  update() {
    if (this.x <= 0 || this.x + this.width >= canvasWidth) {
      this.dx = -this.dx;
    }
    this.x += this.dx;
    ctx.drawImage(bossImg, this.x, this.yOrigin, this.width, this.height);
  }
}

const boss1 = new Boss();

function gameLoop() {
  if (isRunning) {
    backgroundMusic.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawBackground(starryBG);
    if (boss1.active) {
      player.update();
      player.draw(ctx);
      checkBossCollision();
      checkBrickCollision();
      boss1.update();
      ball.update();
      ball.draw(ctx);
      requestAnimationFrame(gameLoop);
    } else {
      player.update();
      player.draw(ctx);
      checkBrickCollision();
      drawAllBricks(bricksArr);
      ball.update();
      ball.draw(ctx);
      requestAnimationFrame(gameLoop);
    }
  }
}

//DRAW ARRAY TO CANVAS
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const array = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
];

const blockSize = 20; // Size of each block

for (let y = 0; y < array.length; y++) {
  for (let x = 0; x < array[y].length; x++) {
    if (array[y][x] === 1) {
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }
}

//CONSTRUCT PLAYER CLASS
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
  }

  update() {
    // Handle player input (e.g., keyboard, gamepad)
    if (keys.left) {
      this.x -= this.speed;
    }
    if (keys.right) {
      this.x += this.speed;
    }
    if (keys.up) {
      this.y -= this.speed;
    }
    if (keys.down) {
      this.y += this.speed;
    }

    // Keep player within game boundaries
    this.x = Math.max(0, Math.min(this.x, canvas.width));
    this.y = Math.max(0, Math.min(this.y, canvas.height));
  }

  draw(ctx) {
    // Draw the player on the canvas
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, 30, 30); 
  }
}
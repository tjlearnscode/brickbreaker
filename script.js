const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');
const canvasHeight = canvas.height = 600;
const canvasWidth = canvas.width = 1200;
let paddleX = 350;
let paddleY = 550;
let ballX = 370;
let ballY = 550;
let ballDX = 5;
let ballDY = 5;
const ballW = 20;
const ballH = 20;
let previousTouchX = 0;
const brick_W = 100;
const brick_H = 50;
let bricks = [];
let brickCoords = [
    {
        "name": "blue",
        "sx": "772",
        "sy": "390",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "blue-cracked",
        "sx": "0",
        "sy": "0",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "light-green",
        "sx": "0",
        "sy": "130",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "light-green-cracked",
        "sx": "0",
        "sy": "260",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "purple",
        "sx": "0",
        "sy": "390",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "purple-cracked",
        "sx": "0",
        "sy": "520",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "red",
        "sx": "772",
        "sy": "260",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "red-cracked",
        "sx": "772",
        "sy": "130",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "orange",
        "sx": "772",
        "sy": "0",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "orange-cracked",
        "sx": "772",
        "sy": "650",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "light-blue",
        "sx": "386",
        "sy": "650",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "light-blue-cracked",
        "sx": "386",
        "sy": "520",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "yellow",
        "sx": "386",
        "sy": "390",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "yellow-cracked",
        "sx": "386",
        "sy": "260",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "dark-green",
        "sx": "386",
        "sy": "130",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "dark-green-cracked",
        "sx": "386",
        "sy": "0",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "grey",
        "sx": "772",
        "sy": "520",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "grey-cracked",
        "sx": "0",
        "sy": "650",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "brown",
        "sx": "386",
        "sy": "780",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "brown-cracked",
        "sx": "0",
        "sy": "780",
        "sw": "384",
        "sh": "128"
    },
    {
        "name": "21-Breakout-Tiles.png",
        "sx": "1533",
        "sy": "392",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "22-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "132",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "23-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "262",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "24-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "392",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "25-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "522",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "26-Breakout-Tiles.png",
        "sx": "1507",
        "sy": "652",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "27-Breakout-Tiles.png",
        "sx": "1533",
        "sy": "132",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "28-Breakout-Tiles.png",
        "sx": "1533",
        "sy": "262",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "29-Breakout-Tiles.png",
        "sx": "1574",
        "sy": "782",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "30-Breakout-Tiles.png",
        "sx": "1533",
        "sy": "522",
        "sw": "128",
        "sh": "128"
    },
    {
        "name": "31-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "66",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "32-Breakout-Tiles.png",
        "sx": "1158",
        "sy": "0",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "33-Breakout-Tiles.png",
        "sx": "1084",
        "sy": "912",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "34-Breakout-Tiles.png",
        "sx": "1084",
        "sy": "846",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "35-Breakout-Tiles.png",
        "sx": "1017",
        "sy": "780",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "36-Breakout-Tiles.png",
        "sx": "839",
        "sy": "912",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "37-Breakout-Tiles.png",
        "sx": "1329",
        "sy": "858",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "38-Breakout-Tiles.png",
        "sx": "1329",
        "sy": "792",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "39-Breakout-Tiles.png",
        "sx": "1403",
        "sy": "0",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "40-Breakout-Tiles.png",
        "sx": "1329",
        "sy": "924",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "41-Breakout-Tiles.png",
        "sx": "1158",
        "sy": "66",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "42-Breakout-Tiles.png",
        "sx": "349",
        "sy": "910",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle",
        "sx": "594",
        "sy": "910",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "fireball",
        "sx": "1262",
        "sy": "726",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "upgrade-fireball",
        "sx": "1158",
        "sy": "132",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "upgrade-slim",
        "sx": "1158",
        "sy": "198",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "upgrade-width",
        "sx": "1158",
        "sy": "264",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "upgrade-laser",
        "sx": "1158",
        "sy": "330",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "upgrade-none",
        "sx": "1158",
        "sy": "396",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-electric1",
        "sx": "1158",
        "sy": "462",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-electric2",
        "sx": "1158",
        "sy": "528",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-electric3",
        "sx": "1158",
        "sy": "594",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-laser1",
        "sx": "1158",
        "sy": "660",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-laser2",
        "sx": "839",
        "sy": "846",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-laser3",
        "sx": "772",
        "sy": "780",
        "sw": "243",
        "sh": "64"
    },
    {
        "name": "paddle-large",
        "sx": "0",
        "sy": "910",
        "sw": "347",
        "sh": "64"
    },
    {
        "name": "small-paddle",
        "sx": "1574",
        "sy": "912",
        "sw": "115",
        "sh": "64"
    },
    {
        "name": "ball",
        "sx": "1403",
        "sy": "652",
        "sw": "64",
        "sh": "64"
    },
    {
        "name": "star",
        "sx": "772",
        "sy": "846",
        "sw": "64",
        "sh": "61"
    },
    {
        "name": "heart",
        "sx": "1637",
        "sy": "652",
        "sw": "64",
        "sh": "58"
    },
    {
        "name": "laser-bullet",

        "sx": "0",
        "sy": "990",
        "sw": "10",
        "sh": "21"
    }
]

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowRight") {
        paddleX += 10;
    } else if (event.key == "ArrowLeft") {
        paddleX -= 10;
    }
})
canvas.addEventListener("touchstart", (event) => {
    previousTouchX = event.touches[0].clientX;
});

canvas.addEventListener("touchmove", (event) => {
    paddleX += event.touches[0].clientX - previousTouchX;
    reviousTouchX = event.touches[0].clientX;
});

const spriteSheet = new Image();
spriteSheet.src = 'Breakout_Tile_Free.png'
spriteSheet.onload = () => {
    drawBricks();
    drawElectricPaddle();
}




class Brick {
    constructor(sx, sy, sw, sh, dx, dy, dw, dh, state) {
        this.sx = Number(sx),
        this.sy = Number(sy),
        this.sw = Number(sw),
        this.sh = Number(sh),
        this.dx = dx,
        this.dy = dy,
        this.dw = dw,
        this.dh = dh,
        this.state = state
    };
};

let brickNum = 20;
//for (i = 11; i < (canvasWidth/brick_W)+11; i++){
for (j = 0; j < 5; j++) {
    for (i = 0; i < (canvasWidth / brick_W); i++) {
        bricks.push(new Brick(brickCoords[0].sx, brickCoords[0].sy, brickCoords[0].sw, brickCoords[0].sh, 0 + i * 100, 0 + 50 * j, 100, 50, 'whole'));
    }
};

function drawBricks() {
    for (k = 0; k < bricks.length; k++) {
        ctx.drawImage(spriteSheet, bricks[k].sx, bricks[k].sy, bricks[k].sw, bricks[k].sh, bricks[k].dx, bricks[k].dy, bricks[k].dw, bricks[k].dh);
    };
};

let lastTimeStamp = 0;
let m = 49
let dw = (brickCoords[m].sw / 2000) * 1000;
let sw = (brickCoords[m].sh / 1500) * 600
function drawElectricPaddle() {
    ctx.drawImage(spriteSheet, brickCoords[m].sx, brickCoords[m].sy, brickCoords[m].sw, brickCoords[m].sh, paddleX, paddleY, dw, sw);
    if (Date.now() - lastTimeStamp >= 100) {
        lastTimeStamp = Date.now();
        if (m == 51) {
            m = 49;
        } else {
            m++
        }
    };
};

function checkCollission() {
    if (ballX + ballW >= canvasWidth || ballX <= 0) {
        ballDX = -ballDX
    }
    if (ballY + ballH >= canvasHeight || ballY <= 0) {
        ballDY = -ballDY;
    }
    if (ballX >= paddleX && ballX <= paddleX + 121) {
        if (ballY + 20 >= paddleY)
            ballDY = -ballDY;
        ;
    };
    for (let i = 0; i < bricks.length; i++) {
        if ((ballX + ballW) >= bricks[i].dx && ballX <= (bricks[i].dx + bricks[i].dw) && (ballY + ballH) >= bricks[i].dy && ballY <= (bricks[i].dy + bricks[i].dh)) {
            if (bricks[i].state === 'cracked') {
                bricks.splice(i, 1)
            } else {
                const crackedBrick = new Brick(brickCoords[1].sx, brickCoords[1].sy, brickCoords[1].sw, brickCoords[1].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh, 'cracked');
                bricks[i] = crackedBrick;
                ctx.drawImage(spriteSheet, bricks[i].sx, bricks[i].sy, bricks[i].sw, bricks[i].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh);
            }
            ballDY = -ballDY;
            break;
        };
    }
}

function drawBall() {
    checkCollission();
    ballY += ballDY;
    ballX += ballDX;
    let ball = brickCoords.filter(b => b.name == "ball")[0]
    ctx.drawImage(spriteSheet, ball.sx, ball.sy, ball.sw, ball.sh, ballX, ballY, 20, 20);
};


function animate() {
    ctx.clearRect(0, 0, 1200, 600)
    drawBricks();
    drawElectricPaddle();
    drawBall();
    requestAnimationFrame(animate)
};


animate();

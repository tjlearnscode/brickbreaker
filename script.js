//updated code to show different colored bricks instead of just blue

import { brickCoords } from "./brickCoords.js";
import { otherSpriteCoords } from "./otherSpriteCoords.js";
const canvas = document.getElementById('mycanvas');

const ctx = canvas.getContext('2d');

const canvasHeight = canvas.height = 600;

const canvasWidth = canvas.width = 1200;

let lives = 3;
let paddleXOrigin = 520;
let paddleYOrigin = 550;
let paddleWOrigin = 150;
let paddleHOrigin = 50;
let paddleX = 520;

let paddleY = 550;
let paddleW = 150;
let paddleH = 50;
let playerScore = 0;

const paddleSpeed = 30;

let ballXOrigin = 550;

let ballYOrigin = 530;

let ballX = 550;

let ballY = 530;

let ballDX = 5;

let ballDY = 5;

const ballW = 20;

const ballH = 20;

let previousTouchX = 0;

const brick_W = 100;

const brick_H = 50;

let animateId;

let bricks = [];

let lastTimeStamp = 0;

let m = 29;

paddleW = (otherSpriteCoords[m].sw / 2000) * 1000;

let dh = (otherSpriteCoords[m].sh / 1500) * 600

function drawElectricPaddle() {

    ctx.drawImage(spriteSheet, otherSpriteCoords[m].sx, otherSpriteCoords[m].sy, otherSpriteCoords[m].sw, otherSpriteCoords[m].sh, paddleX, paddleY, paddleW, dh);

    if (Date.now() - lastTimeStamp >= 100) {

        lastTimeStamp = Date.now();

        if (m == 31) {

            m = 29;

        } else {

            m++

        }

    };

};

document.addEventListener("DOMContentLoaded", function () {

    brickSetup();

    drawBricks();
    drawElectricPaddle();

    drawBall();
    document.getElementById("lives").innerText = lives
})

let startButton = document.getElementById("start");

let resetButton = document.getElementById("reset");

let moveLeftButton = document.getElementById("moveLeft");
let moveRightButton = document.getElementById("moveRight");
startButton.addEventListener("click", start);
resetButton.addEventListener("click", reset);
moveLeftButton.addEventListener("click", moveLeft);
moveRightButton.addEventListener("click", moveRight);


document.addEventListener("keydown", (event) => {

    if (event.key == "ArrowRight") {

        moveRight();
    } else if (event.key == "ArrowLeft") {
        moveLeft();
    }
    else { }
})

canvas.addEventListener("touchstart", (event) => {

    if (paddleX > 0 && paddleX + paddleW < canvasWidth) {
        previousTouchX = event.touches[0].clientX;

    }
});



canvas.addEventListener("touchmove", (event) => {
    paddleX += event.touches[0].clientX - previousTouchX;
    previousTouchX = event.touches[0].clientX;
});



// Get the audio element and mute button

const backgroundMusic = document.getElementById('backgroundMusic');

const paddleCollisionSoundEffect = document.getElementById('paddleCollisionSoundEffect');

const brickCollisionSoundEffect = document.getElementById('brickCollisionSoundEffect');

const muteButton = document.getElementById('muteButton');



// Play the music continuously when it ends

backgroundMusic.addEventListener('ended', function () {

    this.currentTime = 0;

    this.play();

});



backgroundMusic.volume = 0.1;



muteButton.addEventListener('click', function () {

    if (backgroundMusic.muted) {

        backgroundMusic.muted = false;

        paddleCollisionSoundEffect.muted = false;

        brickCollisionSoundEffect.muted = false;

        muteButton.textContent = 'Mute';

    } else {

        backgroundMusic.muted = true;

        paddleCollisionSoundEffect.muted = true;

        brickCollisionSoundEffect.muted = true;

        muteButton.textContent = 'Unmute';

    }

});



const spriteSheet = new Image();

spriteSheet.src = 'Breakout_Tile_Free.png'

spriteSheet.onload = () => {

    drawBricks();

    drawElectricPaddle();
    drawBall();
}



function moveLeft() {
    if (paddleX > 0) {
        paddleX -= paddleSpeed;
    } else { }
}

function moveRight() {

    if (paddleX + paddleW < canvasWidth) {
        paddleX += paddleSpeed;
    } else { }

}




class Brick {

    constructor(sx, sy, sw, sh, dx, dy, dw, dh, state, family) {

        this.sx = Number(sx),

            this.sy = Number(sy),

            this.sw = Number(sw),

            this.sh = Number(sh),

            this.dx = dx,

            this.dy = dy,

            this.dw = dw,

            this.dh = dh,

            this.state = state,

            this.family = family

    };

};



let brickColorFamilies = Object.keys(brickCoords);

//for (i = 11; i < (canvasWidth/brick_W)+11; i++){

function brickSetup() {

    for (let j = 0; j < 5; j++) {

        for (let i = 0; i < (canvasWidth / brick_W); i++) {

            const brickString = brickColorFamilies[Math.floor(Math.random() * brickColorFamilies.length)];

            let brickArr = brickCoords[brickString];

            bricks.push(new Brick(brickArr[0].sx, brickArr[0].sy, brickArr[0].sw, brickArr[0].sh, 0 + i * 100, 0 + 50 * j, 100, 50, 'whole', brickArr[0].family));

        }

    }

}

function drawBricks() {

    for (let k = 0; k < bricks.length; k++) {

        ctx.drawImage(spriteSheet, bricks[k].sx, bricks[k].sy, bricks[k].sw, bricks[k].sh, bricks[k].dx, bricks[k].dy, bricks[k].dw, bricks[k].dh);

    };

};

function checkCollission() {

    if ((paddleX + paddleW >= ballX) && (paddleX <= ballX) && (paddleY === (ballY + ballH))) {
        paddleCollisionSoundEffect.play();

    }



    if (ballX + ballW >= canvasWidth || ballX <= 0) {

        ballDX = -ballDX

    }

    if (ballY + ballH >= canvasHeight) {
        if (lives === 1) {
            reset();
        } else {
            lives -= 1;
            document.getElementById("lives").innerText = lives;
            setup();
        }
    }

    if (ballY <= 0) {

        ballDY = -ballDY;

    }

    if ((ballX + ballW / 2) >= paddleX && (ballX + ballW / 2) <= paddleX + paddleW && ballY + ballH === paddleY) {
        ballDY = -ballDY;
    };

    for (let i = 0; i < bricks.length; i++) {

        if ((ballX + ballW / 2) >= bricks[i].dx && ballX <= (bricks[i].dx + bricks[i].dw)) {

            if ((ballY + ballH) >= bricks[i].dy && ballY <= (bricks[i].dy + bricks[i].dh)) {

                if (bricks[i].state === 'cracked') {

                    bricks.splice(i, 1)

                } else {

                    const crackedBrick = new Brick(brickCoords[bricks[i].family][1].sx, brickCoords[bricks[i].family][1].sy, brickCoords[bricks[i].family][1].sw, brickCoords[bricks[i].family][1].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh, 'cracked', brickCoords[bricks[i].family][1].family);

                    bricks[i] = crackedBrick;

                    ctx.drawImage(spriteSheet, bricks[i].sx, bricks[i].sy, bricks[i].sw, bricks[i].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh);

                }

                ballDY = -ballDY;

                playerScore += 10;

                brickCollisionSoundEffect.play();

                break;

            }



        } else if ((ballY + ballH / 2) >= bricks[i].dy && (ballY + ballH / 2) <= (bricks[i].dy + bricks[i].dh)) {

            if ((ballX + ballW) >= bricks[i].dx && ballX <= (bricks[i].dx + bricks[i].dw)) {

                if (bricks[i].state === 'cracked') {

                    bricks.splice(i, 1)

                } else {

                    const crackedBrick = new Brick(brickCoords[bricks[i].family][1].sx, brickCoords[bricks[i].family][1].sy, brickCoords[bricks[i].family][1].sw, brickCoords[bricks[i].family][1].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh, 'cracked', brickCoords[bricks[i].family][1].family);

                    bricks[i] = crackedBrick;

                    ctx.drawImage(spriteSheet, bricks[i].sx, bricks[i].sy, bricks[i].sw, bricks[i].sh, bricks[i].dx, bricks[i].dy, bricks[i].dw, bricks[i].dh);

                }

                ballDX = -ballDX;

                playerScore += 10;

                brickCollisionSoundEffect.play();

                break;

            }

        }

    }

}

function drawBall() {

    checkCollission();

    ballY += ballDY;

    ballX += ballDX;

    let ball = otherSpriteCoords.filter(sprite => sprite.name == "ball")[0]

    ctx.drawImage(spriteSheet, ball.sx, ball.sy, ball.sw, ball.sh, ballX, ballY, 20, 20);

};


function showLives() {
    document.getElementById("lives").innerText = lives;
}

function start() {

    backgroundMusic.play();

    animate();
    ballDX = 5;
    ballDY = 5;

};

function animate() {

    ctx.clearRect(0, 0, 1200, 600);

    drawBricks();

    drawElectricPaddle();

    drawBall();

    animateId = requestAnimationFrame(animate);

}

function setup() {
    cancelAnimationFrame(animateId);

    ctx.clearRect(0, 0, 1200, 600);

    paddleX = paddleXOrigin;
    paddleY = paddleYOrigin;
    ballX = ballXOrigin;
    ballY = ballYOrigin;
    ballDX = 0;
    ballDY = 0;

    drawBricks();
    drawBall();
    drawElectricPaddle();
}

function reset() {
    lives = 3
    document.getElementById("lives").innerText = lives;

    ctx.clearRect(0, 0, 1200, 600);
    cancelAnimationFrame(animateId);

    paddleX = paddleXOrigin;
    paddleY = paddleYOrigin;
    ballX = ballXOrigin;
    ballY = ballYOrigin;
    ballDX = 0;
    ballDY = 0;

    brickSetup();
    drawBricks();
    drawElectricPaddle();
    drawBall();
}
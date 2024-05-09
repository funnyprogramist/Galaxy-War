const canvas = document.getElementById('myCanvas');
const x = canvas.getContext('2d');
let audio = document.getElementById('audio');
let pause = document.getElementById('pauseBtn');
let count = 0;

function pausePlay(){
    if(count == 0){
        count = 1;
        audio.play();
        pauseBtn.innerHTML = "Pause &#9208;";
    }else{
        count = 0;
        audio.pause();
        pauseBtn.innerHTML = "Play &#9658;";
    }
}

const playerImg = new Image();
playerImg.src = 'ship.png';

const enemyImg = new Image();
enemyImg.src = 'enemy.png'; 

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5
};

let enemies = [];
let score = 0;
let gameEnded = false;

function drawPlayer() {
    x.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(function(enemy) {
        x.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function movePlayer(direction) {
    if (!gameEnded) {
        if (direction === 'left' && player.x > 0) {
            player.x -= player.speed;
        } else if (direction === 'right' && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        movePlayer('left');
    }else if (event.key === 'ArrowRight') {
        movePlayer('right');
    }
});

function createEnemy() {
    const enemy = {
        x: Math.random() * canvas.width,
        y: 0,
        width: 55,
        height: 55,
        speed: Math.random() * 6 + 4 + 2
    };
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach(function(enemy, index) {
        if(!gameEnded) {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
            }
            if (
                enemy.y + enemy.height >= player.y &&
                enemy.x + enemy.width >= player.x &&
                enemy.x <= player.x + player.width
            )
            {
                gameOver();
            }
            if (enemy.y > canvas.height) {
                score++;
                enemies = enemies.filter(function(e) {
                return e !== enemy;
            });
         }
      }
   });
}

function drawScore() {
    x.font = '28px "Roboto Condensed", sans-serif';
    x.fillStyle = '#fff';
    x.fillText('Score: ' + score, 10, 30);
}


function gameOver() {
    gameEnded = true;
    clearInterval(interval);
}

function draw() {
    x.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawScore();
    if(gameEnded) return;
    requestAnimationFrame(draw);
}

const interval = setInterval(createEnemy, 1000);
setInterval(moveEnemies, 50);
draw();

const menu = document.getElementById("menu");
const reactionScreen = document.getElementById("reactionScreen");
const snakeScreen = document.getElementById("snakeScreen");

function showReactionGame(){
    menu.classList.add("hidden");
    reactionScreen.classList.remove("hidden");
}

function showSnakeGame(){
    menu.classList.add("hidden");
    snakeScreen.classList.remove("hidden");
    startSnake();
}

function goHome(){
    reactionScreen.classList.add("hidden");
    snakeScreen.classList.add("hidden");
    menu.classList.remove("hidden");
}

/* --------------------
   REACTION GAME
-------------------- */

const reactionBtn = document.getElementById("reactionBtn");
const reactionBox = document.getElementById("reactionBox");
const reactionResult = document.getElementById("reactionResult");
const bestReaction = document.getElementById("bestReaction");

let startTime;
let ready = false;

let best = localStorage.getItem("bestReaction") || null;

if(best){
    bestReaction.innerText = "Best: " + best + " ms";
}

reactionBtn.addEventListener("click", () => {

    reactionResult.innerText = "";
    reactionBox.style.background = "#dc2626";
    reactionBox.innerText = "Wait...";

    ready = false;

    let delay = Math.random()*3000+2000;

    setTimeout(() => {
        reactionBox.style.background = "#16a34a";
        reactionBox.innerText = "CLICK!";
        startTime = Date.now();
        ready = true;
    }, delay);
});

reactionBox.addEventListener("click", () => {

    if(!ready) return;

    let reaction = Date.now() - startTime;

    reactionResult.innerText =
        "Reaction Time: " + reaction + " ms";

    if(!best || reaction < best){
        best = reaction;
        localStorage.setItem("bestReaction", best);
        bestReaction.innerText =
            "Best: " + best + " ms";
    }

    ready = false;
});

/* --------------------
   SNAKE GAME
-------------------- */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let fruit;
let dx;
let dy;
let score;
let game;

let highScore =
localStorage.getItem("snakeHighScore") || 0;

document.getElementById("highScore").innerText =
highScore;

function startSnake(){

    clearInterval(game);

    snake = [{x:10,y:10}];

    fruit = {
        x:15,
        y:15
    };

    dx = 1;
    dy = 0;

    score = 0;

    document.getElementById("score").innerText = score;

    game = setInterval(drawGame,120);
}

function drawGame(){

    ctx.fillStyle="black";
    ctx.fillRect(0,0,500,500);

    snake.forEach((part,index)=>{

        ctx.fillStyle =
        `hsl(${index*15},100%,50%)`;

        ctx.fillRect(
            part.x*20,
            part.y*20,
            18,
            18
        );
    });

    ctx.fillStyle="red";
    ctx.beginPath();
    ctx.arc(
        fruit.x*20+10,
        fruit.y*20+10,
        8,
        0,
        Math.PI*2
    );
    ctx.fill();

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= 25 ||
        head.y >= 25
    ){
        gameOver();
        return;
    }

    for(let part of snake){
        if(head.x===part.x && head.y===part.y){
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if(head.x===fruit.x && head.y===fruit.y){

        score++;

        document.getElementById("score").innerText =
        score;

        fruit = {
            x:Math.floor(Math.random()*25),
            y:Math.floor(Math.random()*25)
        };

    }else{
        snake.pop();
    }
}

function gameOver(){

    clearInterval(game);

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

        document.getElementById("highScore")
        .innerText = highScore;
    }

    alert("Game Over! Score: " + score);
}

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowUp" && dy!==1){
        dx=0;
        dy=-1;
    }

    if(e.key==="ArrowDown" && dy!==-1){
        dx=0;
        dy=1;
    }

    if(e.key==="ArrowLeft" && dx!==1){
        dx=-1;
        dy=0;
    }

    if(e.key==="ArrowRight" && dx!==-1){
        dx=1;
        dy=0;
    }
});

const rulesBtn=document.getElementById('rules-btn');
const closeBtn=document.getElementById('close-btn');
const rules=document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// Create Ball Properties
const ball = {
    x:canvas.width / 2,
    y:canvas.height / 2,
    size: 10,
    speed:4,
    dx:4,
    dy: -4
}

// Create Paddle Properties
const paddle = {
    x:canvas.width / 2 - 40,
    y:canvas.height - 40,
    w:80,
    h:10,
    speed:8,
    dx:0
}
// Create Brick Properties
const brickInfo = {
    w:70,
    h:20,
    padding: 10,
    offsetX:45,
    offsetY:60,
    visible:true,
}
// Create Bricks
const bricks = [];
for(let i = 0; i < brickRowCount;i++){
    bricks[i] = [];
    for(let j=0; j < brickColumnCount;j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}


// Draw Ball on Canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI * 2);
    ctx.fillStyle="yellow";
    ctx.fill();
    ctx.closePath();
}
// Draw Paddle on Canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h);
    ctx.fillStyle="yellow";
    ctx.fill();
    ctx.closePath();
}
// Draw Bricks on Canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x,brick.y,brick.w,brick.h);
            ctx.fillStyle = brick.visible ? 'yellow' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

// Draw Score on Canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle="lightgreen";
    ctx.fillText(`Score: ${score}`,canvas.width - 100,30);
}
// Move Paddle on Canvas
function movePaddle() {
    paddle.x += paddle.dx;
    // wall detection
    if(paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
    if(paddle.x < 0) {
        paddle.x = 0;
    }
}
// Move Ball on Canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall - Ball Collision Right-Left
    if(ball.x + ball.size > canvas.width || ball.x - ball.size <0) {
        // Reverse to go other way (ball.dx = ball.dx * -1)
        ball.dx *= -1;
    }
    // Wall - Ball Collision Top - Bottom
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }
    // Paddle - Ball Collision
    if(
        ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w && 
        ball.y + ball.size > paddle.y
        ) 
        {
        ball.dy = -ball.speed;
    }
    // Brick - Ball Collision
   bricks.forEach(column => {
    column.forEach(brick => {
        if(brick.visible) {
            if(ball.x - ball.size > brick.x && //left brick side check
                ball.x + ball.size < brick.x + brick.w && //right brick side check
                ball.y + ball.size > brick.y && //top brick side check
                ball.y - ball.size < brick.y + brick.h //bottom brick side check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
        }
    });
   });

// Lose if Hit Bottom
if(ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
}
}
// Increase Score
function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks()
    }
}
// Make all Bricks Appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true))
    });
}


// Draw Main Components
function draw() {
    // First clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks(); 
}
// Update Canvas Drawing and Animation
function update() {
    movePaddle();
    moveBall();

    // Draw everything
    draw();

    requestAnimationFrame(update);
}
update();

// Keydown Event
function keyDown(e) {
   if(e.key === 'ArrowRight' || e.key === 'Right'){
    paddle.dx = paddle.speed;
   } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    paddle.dx = -paddle.speed;
   }
}
// Keyup Event
function keyUp(e) {
    if(e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
        
}

// Keyboard Event Handlers
document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)


// Rules and Close Event Listener
rulesBtn.addEventListener('click',() => rules.classList.add('show'));
closeBtn.addEventListener('click',() => rules.classList.remove('show'));
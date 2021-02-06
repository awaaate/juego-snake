const pixel = 32;
const canvasSize = 480;
const pointsContainer = document.querySelector(".points-container");
let size = 1;
let snake = [{ x: 0, y: 32 }];

let food = randomPos();
let dir_x = 1;
let dir_y = 0;

let gameOver = false;

let apple, body, curve, tail, head;
function preload() {
    apple = loadImage("assets/apple.png");
    body = loadImage("assets/body.png");
    curve = loadImage("assets/body-curve.png");
    tail = loadImage("assets/tail.png");
    head = loadImage("assets/head.png");
}
function setup() {
    createCanvas(canvasSize, canvasSize);
    frameRate(10);
}

function draw() {
    textFont("monospace");
    if (gameOver) {
        background("#161b22");
        fill(255);
        textSize(20)
        noStroke();
        textAlign(CENTER, CENTER);
        text("Pulsa cualquier tecla para comenzar de nuevo", 40, 40, 400, 400);
    } else {
        drawGame();
    }
}
function drawGame() {
    drawBackground();

    const length = snake.length;
    //change head

    const new_head = {
        x: snake[length - 1].x + pixel * dir_x,
        y: snake[length - 1].y + pixel * dir_y,
    };

    if (new_head.x === food.x && new_head.y === food.y) {
        pointsContainer.textContent = size;
        size++;
        food = randomPos();
    }
    //check if has collided
    for (let i = 0; i < length; i++) {
        if (new_head.x === snake[i].x && new_head.y === snake[i].y) {
            gameOver = true;
            break;
        }
    }
    if (
        new_head.x < 0 ||
        new_head.y < 0 ||
        new_head.x > canvasSize ||
        new_head.y > canvasSize
    ) {
        gameOver = true;
    }
    snake.push(new_head);
    drawSnake();
    drawImageAndRotate(apple, food.x, food.y, pixel, pixel, 0);
    if (snake.length !== size) {
        snake = snake.slice(1);
    }
}
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let x = snake[i].x;
        let y = snake[i].y;

        let rotate = 0;
        if (dir_y) {
            rotate = dir_y === 1 ? 180 : 0;
        } else if (dir_x) {
            rotate = dir_x === 1 ? 90 : -90;
        }
        if (i === 0) {
            let next_x = snake[i + 1].x;
            let next_y = snake[i + 1].y;

            if (next_y === y) {
                if (next_x > x) {
                    drawImageAndRotate(tail, x, y, pixel, pixel, 90);
                } else {
                    drawImageAndRotate(tail, x, y, pixel, pixel, -90);
                }
            } else {
                if (next_y > y) {
                    drawImageAndRotate(tail, x, y, pixel, pixel, 180);
                } else {
                    drawImageAndRotate(tail, x, y, pixel, pixel, 0);
                }
            }
        } else if (i === snake.length - 1) {
            drawImageAndRotate(head, x, y, pixel, pixel, rotate);
        } else {
            let next_x = snake[i + 1].x;
            let next_y = snake[i + 1].y;
            let last_x = snake[i - 1].x;
            let last_y = snake[i - 1].y;
            if (next_x !== last_x && next_y !== last_y) {
                if (next_x > x) {
                    if (y > last_y) {
                        drawImageAndRotate(curve, x, y, pixel, pixel, 90);
                    } else {
                        drawImageAndRotate(curve, x, y, pixel, pixel, 180);
                    }
                } else if (next_x < x) {
                    if (y > last_y) {
                        drawImageAndRotate(curve, x, y, pixel, pixel, 0);
                    } else {
                        drawImageAndRotate(curve, x, y, pixel, pixel, -90);
                    }
                } else if (next_y < y) {
                    if (x > last_x) {
                        drawImageAndRotate(curve, x, y, pixel, pixel, 0);
                    } else {
                        drawImageAndRotate(curve, x, y, pixel, pixel, 90);
                    }
                } else {
                    if (x > last_x) {
                        drawImageAndRotate(curve, x, y, pixel, pixel, -90);
                    } else {
                        drawImageAndRotate(curve, x, y, pixel, pixel, -180);
                    }
                }
            } else if (next_y === y) {
                drawImageAndRotate(body, x, y, pixel, pixel, 0);
            } else if (next_x === x) {
                drawImageAndRotate(body, x, y, pixel, pixel, 90);
            }
        }
        //image(snake[i].x, snake[i].y, pixel, pixel);
    }
}
function getAngle() {
    let;
}
function drawBackground() {
    for (let j = 0; j <= 40; j++) {
        for (let i = 0; i <= 40; i++) {
            strokeWeight(4);
            stroke("#777d3e");
            let x = j % 2;
            fill("#8f974a");
            rect(i * pixel, j * pixel, pixel, pixel);
        }
    }
}
function keyPressed() {
    if (gameOver) {
        gameOver = false;
        snake = [{ x: 32, y: 32 * 3 }];
        dir_y = 0;
        dir_x = 1;
        size = 1;
    } else {
        const [x, y] = handleKeydown(key);

        if (key === " ") {
            size++;
        }
        dir_y = y;
        dir_x = x;
    }
}
function randomPos() {
    return {
        x: Math.floor(Math.random() * (canvasSize / pixel - 2)) * pixel + pixel,
        y: Math.floor(Math.random() * (canvasSize / pixel - 2)) * pixel + pixel,
    };
}

function handleKeydown(key) {
    const actual = [dir_x, dir_y];
    const pos =
        {
            w: [0, -1],
            ArrowUp: [0, -1],
            a: [-1, 0],
            ArrowLeft: [-1, 0],
            d: [1, 0],
            ArrowRight: [1, 0],
            s: [0, 1],
            ArrowDown: [0, 1],
        }[key] || actual;
    if (dir_y !== 0 && pos[1]) {
        return actual;
    }
    if (dir_x !== 0 && pos[0]) {
        return actual;
    }
    return pos;
}
function drawImageAndRotate(
    img,
    img_x,
    img_y,
    img_width,
    img_height,
    img_angle
) {
    imageMode(CENTER);
    translate(img_x + img_width / 2, img_y + img_width / 2);
    rotate((PI / 180) * img_angle);
    image(img, 0, 0, img_width, img_height);
    rotate((-PI / 180) * img_angle);
    translate(-(img_x + img_width / 2), -(img_y + img_width / 2));
    imageMode(CORNER);
}

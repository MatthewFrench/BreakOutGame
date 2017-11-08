import {Brick} from "./Brick.js";
import {Paddle} from "./Paddle.js";
import {Ball} from "./Ball.js";

let CollisionSide = {
  Left: 0,
  Right: 1,
  Top: 2,
  Bottom: 3
};

/**
 * Handles manipulation of game data.
 */
export class GameStateLogic {
  constructor(updateStatusCallback, showRestartButtonCallback) {
    this.updateStatusCallback = updateStatusCallback;
    this.showRestartButtonCallback = showRestartButtonCallback;
    this.bricks = [];
    this.balls = [];
    this.paddle = new Paddle();
    this.mainBall = null;

    this.gameWidth = 1000;
    this.gameHeight = 1000;

    this.startSpeed = 3.0;
    this.onHitSpeedUp = 1.05;
    this.maxSpeed = 50.0;

    this.score = 0;
    this.lives = 3;
    this.stageName = '';

    this.gameOver = false;
    this.won = false;

    this.brickBuckets = [];

    this.breakAudio = new Audio('./Sounds/BrickBreak.wav');
    this.lostLifeAudio = new Audio('./Sounds/LostLife.wav');
    this.paddleHitAudio = new Audio('./Sounds/PaddleHit.wav');
  }

  setupLevel1() {
    this.score = 0;
    this.lives = 3;
    this.paddle = new Paddle();
    this.bricks = [];
    this.balls = [];
    this.gameOver = false;
    this.won = false;
    this.stageName = '1/2';

    let brickWidth = 100;
    let brickHeight = 40;
    for (let y = 0; y < 340; y += brickHeight) {
      let color = 'rgb(' + Math.round(Math.random() * 255) + ',' +
        Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
      for (let x = 0; x <= 1000 - brickWidth; x += brickWidth) {

        let smallBrickWidth = brickWidth / 3;
        let smallBrickHeight = brickHeight / 3;
        for (let x2 = 0; x2 <= brickWidth; x2+=smallBrickWidth) {
          for (let y2 = 0; y2 <= brickHeight; y2+=smallBrickHeight) {
            let brick = new Brick();
            brick.setX(Math.floor(x + x2));
            brick.setY(Math.floor(y + y2));
            brick.setWidth(Math.ceil(smallBrickWidth));
            brick.setHeight(Math.ceil(smallBrickHeight));
            if (x2 === 0 || y2 === 0 || x2 === brickWidth || y2 === brickHeight) {
              brick.setColor('white');
            } else {
              brick.setColor(color);
            }
            brick.setScore(1);
            this.bricks.push(brick);
          }
        }
      }
    }

    let ball = new Ball();
    ball.setSpeedX(this.startSpeed * (Math.random() - 0.5));
    ball.setSpeedY(-this.startSpeed);
    ball.setY(790.0);
    ball.setIsMain(true);
    ball.setColor('blue');
    this.balls.push(ball);
    this.mainBall = ball;

    this.updateStatusCallback();

    this.setupBrickBuckets();
  }


  setupLevel2() {
    this.paddle = new Paddle();
    this.bricks = [];
    this.balls = [];
    this.stageName = '2/2';
    this.won = false;
    this.gameOver = false;

    let brickWidth = 100;
    let brickHeight = 40;
    let brickScore = 0;
    for (let y = brickHeight / 2; y < 340; y += brickHeight) {
      let color = 'rgb(' + Math.round(Math.random() * 255) + ',' +
        Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
      brickScore += 1;
      for (let x = brickWidth / 2; x <= 1000 - brickWidth / 2; x += brickWidth) {
        let brick = new Brick();
        brick.setX(x);
        brick.setY(y);
        brick.setWidth(brickWidth);
        brick.setHeight(brickHeight);
        brick.setColor(color);
        brick.setScore(brickScore);
        this.bricks.push(brick);
      }
    }

    let ball = new Ball();
    ball.setSpeedX(this.startSpeed * (Math.random() - 0.5));
    ball.setSpeedY(-this.startSpeed);
    ball.setY(790.0);
    ball.setColor('blue');
    ball.setIsMain(true);
    this.balls.push(ball);
    this.mainBall = ball;

    this.updateStatusCallback();

    this.setupBrickBuckets();
  }

  setupBrickBuckets() {
    this.brickBuckets = [];
    for (let brick of this.bricks) {
      brick.addReference(this.bricks);

      let brickTopLeftX = Math.floor(brick.getX() - brick.getWidth() / 2);
      let brickTopLeftY = Math.floor(brick.getY() - brick.getHeight() / 2);
      let brickBottomRightX = Math.ceil(brick.getX() + brick.getWidth() / 2);
      let brickBottomRightY = Math.ceil(brick.getY() + brick.getHeight() / 2);

      for (let x = brickTopLeftX; x <= brickBottomRightX; x++) {
        for (let y = brickTopLeftY; y <= brickBottomRightY; y++) {
          this.addBrickToBucket(brick, x, y);
        }
      }
    }
  };

  addBrickToBucket(brick, x, y) {
    if (!(x in this.brickBuckets)) {
      this.brickBuckets[x] = [];
    }
    if (!(y in this.brickBuckets[x])) {
      this.brickBuckets[x][y] = [];
    }
    this.brickBuckets[x][y].push(brick);
    brick.addReference(this.brickBuckets[x][y]);
  }

  isOver() {
    return this.gameOver;
  }

  hasWon() {
    return this.won;
  }

  getStageName() {
    return this.stageName;
  }

  getLives() {
    return this.lives;
  }

  runLogic() {
    let addBalls = [];

    ballLoop:
    for (let ballIndex = 0; ballIndex < this.balls.length; ++ballIndex) {
      let ball = this.balls[ballIndex];

      //Slow down time for accurate calculations
      let maxSpeed = Math.ceil(Math.max(Math.abs(ball.getSpeedX()), Math.abs(ball.getSpeedY())));
      let calculationLoops = Math.max(maxSpeed, 1);
      for (let calculationIndex = 0; calculationIndex < calculationLoops; ++calculationIndex) {
        let speedXPerLoop = ball.getSpeedX() / calculationLoops;
        let speedYPerLoop = ball.getSpeedY() / calculationLoops;

        let x = ball.getX();
        let y = ball.getY();
        x += speedXPerLoop;
        y += speedYPerLoop;
        let width = ball.getWidth();
        let height = ball.getHeight();

        let ballHalfWidth = width/2;
        let ballHalfHeight = height/2;
        let ballLeftX = x - ballHalfWidth;
        let ballRightX = x + ballHalfWidth;
        let ballTopY = y - ballHalfHeight;
        let ballBottomY = y + ballHalfHeight;

        let forceOrientBallDownward = false;

        //Do wall collisions
        if (ballLeftX < 0) {
          x = ballHalfWidth;
          speedXPerLoop *= -1;
        }
        if (ballRightX > this.gameWidth) {
          x = this.gameWidth - ballHalfWidth;
          speedXPerLoop *= -1;
        }
        if (ballTopY < 0) {
          y = ballHalfHeight;
          speedYPerLoop *= -1;
        }
        if (ballBottomY > this.gameHeight) {
          y = this.gameHeight - ballHalfHeight;
          speedYPerLoop *= -1;

          //Take lives off if the ball hits the bottom
          if (this.stillPlaying() && ball.getIsMain()) {
            this.lives -= 1;
            this.updateStatusCallback();
            this.playLostLifeSound();
          } else if (this.stillPlaying() && !ball.getIsMain()) {
            this.balls.splice(ballIndex, 1);
            ballIndex -= 1;
            continue ballLoop;
          }
        }

        //Do paddle collision
        let collisionSide = null;
        let collisionDistance = 1000;
        let paddleLeftX = this.paddle.getX() - this.paddle.getWidth() / 2;
        let paddleRightX = this.paddle.getX() + this.paddle.getWidth() / 2;
        let paddleTopY = this.paddle.getY() - this.paddle.getHeight() / 2;
        let paddleBottomY = this.paddle.getY() + this.paddle.getHeight() / 2;
        if (ballRightX > paddleLeftX &&
          ballRightX < this.paddle.getX() &&
          ballBottomY > paddleTopY &&
          ballTopY < paddleBottomY) {
          let dist = Math.abs((ballRightX) - (paddleLeftX));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Left;
            collisionDistance = dist;
          }
        }
        if (ballLeftX < paddleRightX &&
          ballLeftX > this.paddle.getX() &&
          ballBottomY > paddleTopY &&
          ballTopY < paddleBottomY) {
          let dist = Math.abs((ballLeftX) - (paddleRightX));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Right;
            collisionDistance = dist;
          }
        }
        if (ballBottomY > paddleTopY &&
          ballBottomY < this.paddle.getY() &&
          ballRightX > paddleLeftX &&
          ballLeftX < paddleRightX) {
          let dist = Math.abs((ballBottomY) - (paddleTopY));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Top;
            collisionDistance = dist;
          }
        }
        if (ballTopY < paddleBottomY &&
          ballTopY > this.paddle.getY() &&
          ballRightX > paddleLeftX &&
          ballLeftX < paddleRightX) {
          let dist = Math.abs((ballTopY) - (paddleBottomY));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Bottom;
            collisionDistance = dist;
          }
        }
        if (collisionSide === CollisionSide.Left) {
          x = paddleLeftX - ballHalfWidth;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Right) {
          x = paddleRightX + ballHalfWidth;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Top) {
          y = paddleTopY - ballHalfHeight;
          speedYPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Bottom) {
          y = paddleBottomY + ballHalfHeight;
          speedYPerLoop *= -1;
        }
        //Do a shift in x direction based on the paddle
        if (collisionSide !== null) {
          this.playHitPaddleSound();
          //Crummy changing speed math because I'm too lazy to make a
          //vector class with automatic conversion on getters and setters
          //even though it would probably take less effort than this.
          let paddlePositionPercentage = (x - this.paddle.getX()) / this.paddle.getWidth();
          let currentSpeed = Math.sqrt(Math.pow(speedXPerLoop, 2) +
            Math.pow(speedYPerLoop, 2));
          speedXPerLoop = (paddlePositionPercentage) *
            Math.max(currentSpeed / 2, Math.abs(speedXPerLoop / 2)) + speedXPerLoop;
          if (Math.abs(speedXPerLoop) > Math.abs(speedYPerLoop)) {
            if (speedXPerLoop < 0) {
              speedXPerLoop = -Math.abs(speedYPerLoop);
            } else {
              speedXPerLoop = Math.abs(speedYPerLoop);
            }
          }
        }

        //Do brick collision

        let ballTopLeftX = Math.floor(ballLeftX);
        let ballTopLeftY = Math.floor(ballTopY);
        let ballBottomRightX = Math.ceil(ballRightX);
        let ballBottomRightY = Math.ceil(ballBottomY);

        for (let x = ballTopLeftX; x <= ballBottomRightX; x++) {
          if (!(x in this.brickBuckets)) {
            continue;
          }
          for (let y = ballTopLeftY; y <= ballBottomRightY; y++) {
            if (!(y in this.brickBuckets[x])) {
              continue;
            }
            let bricks = this.brickBuckets[x][y];

            for (let brickIndex = 0; brickIndex < bricks.length; ++brickIndex) {
              let brick = bricks[brickIndex];
              let brickLeftX = brick.getX() - brick.getWidth() / 2;
              //Skip the brick if it's outside
              if (ballRightX < brickLeftX) {
                continue;
              }
              let brickRightX = brick.getX() + brick.getWidth() / 2;
              if (ballLeftX > brickRightX) {
                continue;
              }
              let brickTopY = brick.getY() - brick.getHeight() / 2;
              if (ballBottomY < brickTopY) {
                continue;
              }
              let brickBottomY = brick.getY() + brick.getHeight() / 2;
              if (ballTopY > brickBottomY) {
                continue;
              }

              let collisionSide = null;
              let collisionDistance = 1000;
              if (ballRightX > brickLeftX &&
                ballRightX < brick.getX() &&
                ballBottomY > brickTopY &&
                ballTopY < brickBottomY) {
                let dist = Math.abs((ballRightX) - (brickLeftX));
                if (dist < collisionDistance) {
                  collisionSide = CollisionSide.Left;
                  collisionDistance = dist;
                }
              }
              if (ballLeftX < brickRightX &&
                ballLeftX > brick.getX() &&
                ballBottomY > brickTopY &&
                ballTopY < brickBottomY) {
                let dist = Math.abs((ballLeftX) - (brickRightX));
                if (dist < collisionDistance) {
                  collisionSide = CollisionSide.Right;
                  collisionDistance = dist;
                }
              }
              if (ballBottomY > brickTopY &&
                ballBottomY < brick.getY() &&
                ballRightX > brickLeftX &&
                ballLeftX < brickRightX) {
                let dist = Math.abs((ballBottomY) - (brickTopY));
                if (dist < collisionDistance) {
                  collisionSide = CollisionSide.Top;
                  collisionDistance = dist;
                }
              }
              if (ballTopY < brickBottomY &&
                ballTopY > brick.getY() &&
                ballRightX > brickLeftX &&
                ballLeftX < brickRightX) {
                let dist = Math.abs((ballTopY) - (brickBottomY));
                if (dist < collisionDistance) {
                  collisionSide = CollisionSide.Bottom;
                  collisionDistance = dist;
                }
              }
              if (collisionSide === CollisionSide.Left) {
                x = brickLeftX - ballHalfWidth;
                speedXPerLoop *= -1;
              } else if (collisionSide === CollisionSide.Right) {
                x = brickRightX + ballHalfWidth;
                speedXPerLoop *= -1;
              } else if (collisionSide === CollisionSide.Top) {
                y = brickTopY - ballHalfHeight;
                speedYPerLoop *= -1;
              } else if (collisionSide === CollisionSide.Bottom) {
                y = brickBottomY + ballHalfHeight;
                speedYPerLoop *= -1;
                forceOrientBallDownward = true;
              }

              if (collisionSide !== null) {
                //console.log('Removing brick references');
                //console.log('Initial brick count: ' + bricks.length);
                //Remove brick
                brick.removeFromReferences();
                //console.log('De-incrementing brick index');
                brickIndex--;
                //console.log('Final brick count: ' + bricks.length);
                this.playBrickBreakSound();

                let newBall = new Ball();
                newBall.setX(ball.getX());
                newBall.setY(ball.getY());
                newBall.setSpeedX(ball.getSpeedX() * -1);
                newBall.setSpeedY(Math.abs(ball.getSpeedY()));
                addBalls.push(newBall);

                if (this.stillPlaying()) {
                  this.score += brick.getScore();
                  this.updateStatusCallback();
                }
                //Speed up the ball
                if (Math.pow(speedXPerLoop * calculationLoops, 2) +
                  Math.pow(speedYPerLoop * calculationLoops, 2) < this.maxSpeed) {
                  speedXPerLoop *= this.onHitSpeedUp;
                  speedYPerLoop *= this.onHitSpeedUp;
                }
              }
            }
          }
        }

        ball.setSpeedX(speedXPerLoop * calculationLoops);
        ball.setSpeedY(speedYPerLoop * calculationLoops);
        if (forceOrientBallDownward) {
          ball.setSpeedY(Math.abs(ball.getSpeedY()));
        }
        ball.setX(x);
        ball.setY(y);
      }
    }

    //Add balls
    for (let ball of addBalls) {
      this.balls.push(ball);
    }

    //Check if dead
    if (this.gameOver == false) {
      if (this.lives <= 0) {
        this.showRestartButtonCallback();
        this.gameOver = true;
        this.updateStatusCallback();
        //Spawn a ton of balls for fun
        for (let i = 0 ;i < 100; i++) {
          let ball = new Ball();
          ball.setSpeedX(20.0 * (Math.random() - 0.5));
          ball.setSpeedY(-20.0 * Math.random() + -1.0);
          ball.setY(790.0);
          this.balls.push(ball);
        }
      } else if (this.bricks.length === 0) {
        if (this.stageName === '1/2') {
          //Switch to second stage
          this.setupLevel2();
        } else {
          //Say we won
          this.won = true;
          this.gameOver = true;
          this.showRestartButtonCallback();
        }
        this.updateStatusCallback();
      }
    }
  }

  getMainBall() {
    return this.mainBall;
  }

  playBrickBreakSound() {
    this.breakAudio.play();
  }

  playLostLifeSound() {
    this.lostLifeAudio.play();
  }

  playHitPaddleSound() {
    this.paddleHitAudio.play();
  }

  stillPlaying() {
    return this.gameOver === false &&
      this.won === false && this.lives > 0 && this.bricks.length > 0;
  }

  getScore() {
    return this.score;
  }

  setPaddleLocation(x) {
    this.paddle.setX(x);
  }

  getPaddle() {
    return this.paddle;
  }

  getBricks() {
    return this.bricks;
  }

  getBalls() {
    return this.balls;
  }
}
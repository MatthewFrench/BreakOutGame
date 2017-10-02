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
  constructor(updateStatusCallback) {
    this.updateStatusCallback = updateStatusCallback;
    this.bricks = [];
    this.balls = [];
    this.paddle = new Paddle();

    this.gameWidth = 1000;
    this.gameHeight = 1000;

    this.startSpeed = 3.0;
    this.onHitSpeedUp = 1.05;
    this.maxSpeed = 50.0;

    this.score = 0;
    this.lives = 3;
    this.stageName = '';
  }

  setupLevel1() {
    this.score = 0;
    this.lives = 3;
    this.paddle = new Paddle();
    this.bricks = [];
    this.balls = [];
    this.stageName = '1/2';

    let brickWidth = 100;
    let brickHeight = 40;
    for (let y = brickHeight / 2; y < 340; y += brickHeight) {
      let color = 'rgb(' + Math.round(Math.random() * 255) + ',' +
        Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
      for (let x = brickWidth / 2; x <= 1000 - brickWidth / 2; x += brickWidth) {
        let brick = new Brick();
        brick.setX(x);
        brick.setY(y);
        brick.setWidth(brickWidth);
        brick.setHeight(brickHeight);
        brick.setColor(color);
        brick.setScore(1);
        this.bricks.push(brick);
      }
    }

    let ball = new Ball();
    ball.setSpeedX(this.startSpeed * (Math.random() - 0.5));
    ball.setSpeedY(-this.startSpeed);
    ball.setY(790.0);
    this.balls.push(ball);

    this.updateStatusCallback();
  }


  setupLevel2() {
    this.paddle = new Paddle();
    this.bricks = [];
    this.balls = [];
    this.stageName = '2/2';

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
    this.balls.push(ball);

    this.updateStatusCallback();
  }

  isOver() {
    return this.bricks.length === 0;
  }

  getStageName() {
    return this.stageName;
  }

  getLives() {
    return this.lives;
  }

  runLogic() {
    for (let ball of this.balls) {

      //Slow down time for accurate calculations
      let maxSpeed = Math.ceil(Math.max(Math.abs(ball.getSpeedX()), Math.abs(ball.getSpeedY())));
      let calculationLoops = Math.max(maxSpeed, 1);
      for (let calculationIndex = 0; calculationIndex < calculationLoops; calculationIndex += 1) {
        let speedXPerLoop = ball.getSpeedX() / calculationLoops;
        let speedYPerLoop = ball.getSpeedY() / calculationLoops;

        let x = ball.getX();
        let y = ball.getY();
        x += speedXPerLoop;
        y += speedYPerLoop;
        let width = ball.getWidth();
        let height = ball.getHeight();

        //Do wall collisions
        if (x - width / 2 < 0) {
          x = width / 2;
          speedXPerLoop *= -1;
        }
        if (x + width / 2 > this.gameWidth) {
          x = this.gameWidth - width / 2;
          speedXPerLoop *= -1;
        }
        if (y - height / 2 < 0) {
          y = height / 2;
          speedYPerLoop *= -1;
        }
        if (y + height / 2 > this.gameHeight) {
          y = this.gameHeight - height / 2;
          speedYPerLoop *= -1;
        }

        //Do paddle collision
        let collisionSide = null;
        let collisionDistance = 1000;
        if (x + width / 2 > this.paddle.getX() - this.paddle.getWidth() / 2 &&
          x + width / 2 < this.paddle.getX() &&
          y + height / 2 > this.paddle.getY() - this.paddle.getHeight() / 2 &&
          y - height / 2 < this.paddle.getY() + this.paddle.getHeight() / 2) {
          let dist = Math.abs((x + width / 2) - (this.paddle.getX() - this.paddle.getWidth() / 2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Left;
            collisionDistance = dist;
          }
        }
        if (x - width / 2 < this.paddle.getX() + this.paddle.getWidth() / 2 &&
          x - width / 2 > this.paddle.getX() &&
          y + height / 2 > this.paddle.getY() - this.paddle.getHeight() / 2 &&
          y - height / 2 < this.paddle.getY() + this.paddle.getHeight() / 2) {
          let dist = Math.abs((x - width / 2) - (this.paddle.getX() + this.paddle.getWidth() / 2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Right;
            collisionDistance = dist;
          }
        }
        if (y + height / 2 > this.paddle.getY() - this.paddle.getHeight() / 2 &&
          y + height / 2 < this.paddle.getY() &&
          x + width / 2 > this.paddle.getX() - this.paddle.getWidth() / 2 &&
          x - width / 2 < this.paddle.getX() + this.paddle.getWidth() / 2) {
          let dist = Math.abs((y + height / 2) - (this.paddle.getY() - this.paddle.getHeight() / 2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Top;
            collisionDistance = dist;
          }
        }
        if (y - height / 2 < this.paddle.getY() + this.paddle.getHeight() / 2 &&
          y - height / 2 > this.paddle.getY() &&
          x + width / 2 > this.paddle.getX() - this.paddle.getWidth() / 2 &&
          x - width / 2 < this.paddle.getX() + this.paddle.getWidth() / 2) {
          let dist = Math.abs((y - height / 2) - (this.paddle.getY() + this.paddle.getHeight() / 2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Bottom;
            collisionDistance = dist;
          }
        }
        if (collisionSide === CollisionSide.Left) {
          x = this.paddle.getX() - this.paddle.getWidth() / 2 - width / 2;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Right) {
          x = this.paddle.getX() + this.paddle.getWidth() / 2 + width / 2;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Top) {
          y = this.paddle.getY() - this.paddle.getHeight() / 2 - height / 2;
          speedYPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Bottom) {
          y = this.paddle.getY() + this.paddle.getHeight() / 2 + height / 2;
          speedYPerLoop *= -1;
        }
        //Do a shift in x direction based on the paddle
        if (collisionSide !== null) {
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
        for (let brick of this.bricks) {
          //Skip the brick if it's outside
          if (x + width / 2 < brick.getX() - brick.getWidth() / 2) {
            continue;
          }
          if (x - width / 2 > brick.getX() + brick.getWidth() / 2) {
            continue;
          }
          if (y + height / 2 < brick.getY() - brick.getHeight() / 2) {
            continue;
          }
          if (y - height / 2 > brick.getY() + brick.getHeight() / 2) {
            continue;
          }

          let collisionSide = null;
          let collisionDistance = 1000;
          if (x + width / 2 > brick.getX() - brick.getWidth() / 2 &&
            x + width / 2 < brick.getX() &&
            y + height / 2 > brick.getY() - brick.getHeight() / 2 &&
            y - height / 2 < brick.getY() + brick.getHeight() / 2) {
            let dist = Math.abs((x + width / 2) - (brick.getX() - brick.getWidth() / 2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Left;
              collisionDistance = dist;
            }
          }
          if (x - width / 2 < brick.getX() + brick.getWidth() / 2 &&
            x - width / 2 > brick.getX() &&
            y + height / 2 > brick.getY() - brick.getHeight() / 2 &&
            y - height / 2 < brick.getY() + brick.getHeight() / 2) {
            let dist = Math.abs((x - width / 2) - (brick.getX() + brick.getWidth() / 2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Right;
              collisionDistance = dist;
            }
          }
          if (y + height / 2 > brick.getY() - brick.getHeight() / 2 &&
            y + height / 2 < brick.getY() &&
            x + width / 2 > brick.getX() - brick.getWidth() / 2 &&
            x - width / 2 < brick.getX() + brick.getWidth() / 2) {
            let dist = Math.abs((y + height / 2) - (brick.getY() - brick.getHeight() / 2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Top;
              collisionDistance = dist;
            }
          }
          if (y - height / 2 < brick.getY() + brick.getHeight() / 2 &&
            y - height / 2 > brick.getY() &&
            x + width / 2 > brick.getX() - brick.getWidth() / 2 &&
            x - width / 2 < brick.getX() + brick.getWidth() / 2) {
            let dist = Math.abs((y - height / 2) - (brick.getY() + brick.getHeight() / 2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Bottom;
              collisionDistance = dist;
            }
          }
          if (collisionSide === CollisionSide.Left) {
            x = brick.getX() - brick.getWidth() / 2 - width / 2;
            speedXPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Right) {
            x = brick.getX() + brick.getWidth() / 2 + width / 2;
            speedXPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Top) {
            y = brick.getY() - brick.getHeight() / 2 - height / 2;
            speedYPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Bottom) {
            y = brick.getY() + brick.getHeight() / 2 + height / 2;
            speedYPerLoop *= -1;
          }

          if (collisionSide !== null && brick.getMarkForRemoval() === false) {
            brick.setMarkForRemoval(true);
            this.score += brick.getScore();
            this.updateStatusCallback();
            //Speed up the ball
            if (Math.pow(speedXPerLoop * calculationLoops, 2) +
              Math.pow(speedYPerLoop * calculationLoops, 2) < this.maxSpeed) {
              speedXPerLoop *= this.onHitSpeedUp;
              speedYPerLoop *= this.onHitSpeedUp;
            }
          }
        }


        ball.setSpeedX(speedXPerLoop * calculationLoops);
        ball.setSpeedY(speedYPerLoop * calculationLoops);
        ball.setX(x);
        ball.setY(y);
      }
    }

    //Remove marked blocks
    let oldCount = this.bricks.length;
    this.bricks = this.bricks.filter((brick) => {
      return !brick.getMarkForRemoval();
    });
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
import {Brick} from "./Brick.js";
import {Paddle} from "./Paddle.js";
import {Ball} from "./Ball.js";

let CollisionSide = {
  Left : 0,
  Right: 1,
  Top: 2,
  Bottom: 3
};

/**
 * Handles manipulation of game data.
 */
export class GameStateLogic {
  constructor() {
    this.bricks = [];
    this.balls = [];
    this.paddle = new Paddle();

    this.gameWidth = 1000;
    this.gameHeight = 1000;

    for (let x = 50; x < 1000 - 40; x += 90) {
      for (let y = 25; y < 400; y += 40) {
        let brick = new Brick();
        brick.setX(x);
        brick.setY(y);
        this.bricks.push(brick);
      }
    }

    let ball = new Ball();
    ball.setSpeedX(-5.0);
    ball.setSpeedY(-5.0);
    ball.setY(1000.0);
    this.balls.push(ball);

    for (let i = 0; i < 5; i++) {
      let ball = new Ball();
      ball.setSpeedX(Math.random() * -10);
      ball.setSpeedY(Math.random() * -10);
      ball.setY(1000.0);
      this.balls.push(ball);
    }

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
        if (x - width/2 < 0) {
          x = width/2;
          speedXPerLoop *= -1;
        }
        if (x + width/2 > this.gameWidth) {
          x = this.gameWidth - width/2;
          speedXPerLoop *= -1;
        }
        if (y - height/2 < 0) {
          y = height/2;
          speedYPerLoop *= -1;
        }
        if (y + height/2 > this.gameHeight) {
          y = this.gameHeight - height/2;
          speedYPerLoop *= -1;
        }

        //Do paddle collision
        let collisionSide = null;
        let collisionDistance = 1000;
        if (x + width/2 > this.paddle.getX() - this.paddle.getWidth()/2 &&
          x + width/2 < this.paddle.getX() &&
          y + height/2 > this.paddle.getY() - this.paddle.getHeight()/2 &&
          y - height/2 < this.paddle.getY() + this.paddle.getHeight()/2) {
          let dist = Math.abs((x + width/2) - (this.paddle.getX() - this.paddle.getWidth()/2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Left;
            collisionDistance = dist;
          }
        }
        if (x - width/2 < this.paddle.getX() + this.paddle.getWidth()/2 &&
          x - width/2 > this.paddle.getX() &&
          y + height/2 > this.paddle.getY() - this.paddle.getHeight()/2 &&
          y - height/2 < this.paddle.getY() + this.paddle.getHeight()/2) {
          let dist = Math.abs((x - width/2) - (this.paddle.getX() + this.paddle.getWidth()/2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Right;
            collisionDistance = dist;
          }
        }
        if (y + height/2 > this.paddle.getY() - this.paddle.getHeight()/2 &&
          y + height/2 < this.paddle.getY() &&
          x + width/2 > this.paddle.getX() - this.paddle.getWidth()/2 &&
          x - width/2 < this.paddle.getX() + this.paddle.getWidth()/2) {
          let dist = Math.abs((y + height/2) - (this.paddle.getY() - this.paddle.getHeight()/2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Top;
            collisionDistance = dist;
          }
        }
        if (y - height/2 < this.paddle.getY() + this.paddle.getHeight()/2 &&
          y - height/2 > this.paddle.getY() &&
          x + width/2 > this.paddle.getX() - this.paddle.getWidth()/2 &&
          x - width/2 < this.paddle.getX() + this.paddle.getWidth()/2) {
          let dist = Math.abs((y - height/2) - (this.paddle.getY() + this.paddle.getHeight()/2));
          if (dist < collisionDistance) {
            collisionSide = CollisionSide.Bottom;
            collisionDistance = dist;
          }
        }
        if (collisionSide === CollisionSide.Left) {
          x = this.paddle.getX() - this.paddle.getWidth()/2 - width/2;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Right) {
          x = this.paddle.getX() + this.paddle.getWidth()/2 + width/2;
          speedXPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Top) {
          y = this.paddle.getY() - this.paddle.getHeight()/2 - height/2;
          speedYPerLoop *= -1;
        } else if (collisionSide === CollisionSide.Bottom) {
          y = this.paddle.getY() + this.paddle.getHeight()/2 + height/2;
          speedYPerLoop *= -1;
        }

        //Do brick collision
        for (let brick of this.bricks) {
          //Skip the brick if it's outside
          if (x + width/2 < brick.getX() - brick.getWidth()/2) {
            continue;
          }
          if (x - width/2 > brick.getX() + brick.getWidth()/2) {
            continue;
          }
          if (y + height/2 < brick.getY() - brick.getHeight()/2) {
            continue;
          }
          if (y - height/2 > brick.getY() + brick.getHeight()/2) {
            continue;
          }

          let collisionSide = null;
          let collisionDistance = 1000;
          if (x + width/2 > brick.getX() - brick.getWidth()/2 &&
            x + width/2 < brick.getX() &&
            y + height/2 > brick.getY() - brick.getHeight()/2 &&
            y - height/2 < brick.getY() + brick.getHeight()/2) {
            let dist = Math.abs((x + width/2) - (brick.getX() - brick.getWidth()/2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Left;
              collisionDistance = dist;
            }
          }
          if (x - width/2 < brick.getX() + brick.getWidth()/2 &&
            x - width/2 > brick.getX() &&
            y + height/2 > brick.getY() - brick.getHeight()/2 &&
            y - height/2 < brick.getY() + brick.getHeight()/2) {
            let dist = Math.abs((x - width/2) - (brick.getX() + brick.getWidth()/2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Right;
              collisionDistance = dist;
            }
          }
          if (y + height/2 > brick.getY() - brick.getHeight()/2 &&
            y + height/2 < brick.getY() &&
            x + width/2 > brick.getX() - brick.getWidth()/2 &&
            x - width/2 < brick.getX() + brick.getWidth()/2) {
            let dist = Math.abs((y + height/2) - (brick.getY() - brick.getHeight()/2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Top;
              collisionDistance = dist;
            }
          }
          if (y - height/2 < brick.getY() + brick.getHeight()/2 &&
            y - height/2 > brick.getY() &&
            x + width/2 > brick.getX() - brick.getWidth()/2 &&
            x - width/2 < brick.getX() + brick.getWidth()/2) {
            let dist = Math.abs((y - height/2) - (brick.getY() + brick.getHeight()/2));
            if (dist < collisionDistance) {
              collisionSide = CollisionSide.Bottom;
              collisionDistance = dist;
            }
          }
          if (collisionSide === CollisionSide.Left) {
            x = brick.getX() - brick.getWidth()/2 - width/2;
            speedXPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Right) {
            x = brick.getX() + brick.getWidth()/2 + width/2;
            speedXPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Top) {
            y = brick.getY() - brick.getHeight()/2 - height/2;
            speedYPerLoop *= -1;
          } else if (collisionSide === CollisionSide.Bottom) {
            y = brick.getY() + brick.getHeight()/2 + height/2;
            speedYPerLoop *= -1;
          }
        }

        ball.setSpeedX(speedXPerLoop * calculationLoops);
        ball.setSpeedY(speedYPerLoop * calculationLoops);
        ball.setX(x);
        ball.setY(y);
      }
    }

    if (Math.random() * 100 > 20) {
      let ball = new Ball();
      ball.setSpeedX(Math.random() * -10);
      ball.setSpeedY(Math.random() * -10);
      ball.setY(1000.0);
      this.balls.push(ball);
    }
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
import {Brick} from "./Brick.js";
import {Paddle} from "./Paddle.js";

/**
 * Handles manipulation of game data.
 */
export class GameStateLogic {
  constructor() {
    this.bricks = [];
    this.paddle = new Paddle();
  }
  setPaddleLocation(x) {
    this.paddle.setX(x);
  }

  getPaddle() {
    return this.paddle;
  }
}
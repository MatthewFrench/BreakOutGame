import {GameStateLogic} from "./Logic/GameStateLogic.js";
import {Utility} from "../../Utility.js";

/**
 * Handles all canvas drawing logic.
 */
export class CanvasBoard {
  constructor(gamePage) {
    this.gamePage = gamePage;
    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'CanvasBoardDiv';
    this.ctx = null;
    this.canvas = null;
    this.containerDiv = null;
    this.messageDiv = null;
    this.scoreDiv = null;
    this.gameDataLogic = new GameStateLogic(()=>{this.updateGameStatusMessage();});

    window.addEventListener('resize', Utility.CreateFunction(this, this.windowResize));
    window.requestAnimationFrame(()=>{this.windowResize();});

    this.renderLoopRequest = null;

    this.setupCanvas();
  }

  /**
   * Reset the board and game
   */
  reset() {
    this.gameDataLogic = new GameStateLogic(()=>{this.updateGameStatusMessage();});

    this.windowResize();

    this.renderBoard();

    this.updateGameStatusMessage();
  }

  /**
   * Set the canvas scaling based on the window size.
   */
  windowResize() {
    if (window.innerWidth > window.innerHeight - 30 - 30) {
      //Set the canvas to scale by height
      if (!this.canvas.classList.contains('CanvasGreaterWidth')) {
        this.canvas.classList.remove('CanvasGreaterHeight');
        this.canvas.classList.add('CanvasGreaterWidth');
      }
    } else {
      //Set the canvas to scale by width
      if (!this.canvas.classList.contains('CanvasGreaterHeight')) {
        this.canvas.classList.remove('CanvasGreaterWidth');
        this.canvas.classList.add('CanvasGreaterHeight');
      }
    }
  }

  /**
   * Sets up the HTML5 canvas.
   */
  setupCanvas() {
    this.messageDiv = document.createElement('div');
    this.messageDiv.className = 'MessageDiv';
    this.scoreDiv = document.createElement('div');
    this.scoreDiv.className = 'ScoreDiv';
    this.containerDiv = document.createElement('div');
    this.containerDiv.className = 'ContainerDiv';
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('touchmove', Utility.CreateFunction(this, this.tapMove));
    this.canvas.addEventListener('mousemove', Utility.CreateFunction(this, this.mouseMove));
    this.canvas.addEventListener('mousedown', Utility.CreateFunction(this, this.mouseDown));
    this.canvas.addEventListener('mouseup', Utility.CreateFunction(this, this.mouseUp));
    this.canvas.width = 1000;
    this.canvas.height = 1000;
    this.containerDiv.appendChild(this.canvas);
    this.mainDiv.appendChild(this.scoreDiv);
    this.mainDiv.appendChild(this.messageDiv);
    this.mainDiv.appendChild(this.containerDiv);
    this.ctx = this.canvas.getContext('2d');
  }

  show() {
    this.renderLoop();
  }

  hide() {
    if (this.renderLoopRequest != null) {
      window.cancelAnimationFrame(this.renderLoopRequest);
    }
  }

  startLevel1() {
    this.gameDataLogic.setupLevel1();
  }

  startLevel2() {
    this.gameDataLogic.setupLevel2();
  }

  renderLoop() {
    this.gameDataLogic.runLogic();

    this.renderBoard();

    this.renderLoopRequest = window.requestAnimationFrame(()=>{this.renderLoop();});
  }

  /**
   * Handles mouse down logic.
   * @param event
   */
  mouseDown(event) {

  }

  mouseMove(event) {
    this.gameDataLogic.setPaddleLocation(this.getCanvasMouseX(event));
  }

  tapMove(event) {
    this.gameDataLogic.setPaddleLocation(this.getCanvasTapX(event));
  }

  /**
   * Handles the mouse up event.
   * @param event
   */
  mouseUp() {
    let x = this.getCanvasMouseX(event);
    let y = this.getCanvasMouseY(event);
  }

  /**
   * Sets the message of the message div.
   * @param text
   */
  setMessage(text) {
    this.messageDiv.innerText = text;
  }

  setScore(text) {
    this.scoreDiv.innerText = text;
  }

  /**
   * Updates the top message.
   */
  updateGameStatusMessage() {
    let statusText = 'Stage: ' + this.gameDataLogic.getStageName()
    +', Lives: ' + this.gameDataLogic.getLives();
    let scoreText = 'Score: ' + this.gameDataLogic.getScore();
    this.setMessage(statusText);
    this.setScore(scoreText);
  }

  /**
   * Returns the mouse X position on the canvas.
   * @param event
   */
  getCanvasMouseX(event) {
    //Get mouse position
    let bounds = event.target.getBoundingClientRect();
    let mouseX = event.clientX - bounds.left;
    return mouseX * this.canvas.width / bounds.width;
  }


  getCanvasTapX(event) {
    console.dir(event);
    //Get tap position
    let bounds = event.touches[0].target.getBoundingClientRect();
    let mouseX = event.touches[0].clientX - bounds.left;
    return mouseX * this.canvas.width / bounds.width;
  }

  /**
   * Returns the mouse Y position on the canvas.
   * @param event
   */
  getCanvasMouseY(event) {
    //Get mouse position
    let bounds = event.target.getBoundingClientRect();
    let mouseY = event.clientY - bounds.top;
    return mouseY * this.canvas.height / bounds.height;
  }

  /**
   * Redraws the entire checker board.
   */
  renderBoard() {
    this.ctx.fillStyle = 'lightgray';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.gameDataLogic.getPaddle().render(this.ctx);

    for (let brick of this.gameDataLogic.getBricks()) {
      brick.render(this.ctx);
    }

    for (let ball of this.gameDataLogic.getBalls()) {
      ball.render(this.ctx);
    }
  }

  /**
   * Returns the canvas board div element.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}
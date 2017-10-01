

export class Ball {
  constructor() {
    this.x = 500;
    this.y = 800;
    this.speedX = 0;
    this.speedY = 0;
    this.height = 10;
    this.width = 10;
  }

  getSpeedX() {
    return this.speedX;
  }

  getSpeedY() {
    return this.speedY;
  }

  setSpeedX(x) {
    this.speedX = x;
  }

  setSpeedY(y) {
    this.speedY = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;
  }

  render(context) {
    context.fillStyle = 'green';
    context.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
  }
}
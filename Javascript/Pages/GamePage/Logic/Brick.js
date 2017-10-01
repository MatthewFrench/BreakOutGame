

export class Brick {
  constructor() {
    this.x = 500;
    this.y = 100;
    this.height = 10;
    this.width = 50;
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
    context.fillStyle = 'red';
    context.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
  }
}
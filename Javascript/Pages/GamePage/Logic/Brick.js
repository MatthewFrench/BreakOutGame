

export class Brick {
  constructor() {
    this.x = 500;
    this.y = 100;
    this.height = 10;
    this.width = 50;
    this.color = 'red';
    this.score = 1;
    this.inArrays = [];
  }

  addReference(refArray) {
    this.inArrays.push(refArray);
  }
  removeFromReferences() {
    for (let array of this.inArrays) {
      array.splice(array.indexOf(this), 1);
    }
    this.inArrays = [];
  }

  checkReferences() {
    for (let array in this.inArrays) {
      if (array.length === 0) {
        console.log('Invalid reference');
      } else {
        if (array.indexOf(this) === -1) {
          console.log('Can\'t find self in reference');
        }
      }
    }
  }

  setScore(score) {
    this.score = score;
  }

  getScore() {
    return this.score;
  }

  setColor(color) {
    this.color = color;
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
    context.fillStyle = this.color;
    context.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
  }
}
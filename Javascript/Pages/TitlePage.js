class TitlePage {
  constructor(breakOutGame) {
    this.breakOutGame = breakOutGame;

    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'TitlePage';

    //Create title
    let titleDiv = document.createElement('div');
    titleDiv.className = 'TitleDiv';
    let letters = document.createElement('span');
    letters.innerText = 'Break Out';
    titleDiv.appendChild(letters);
    this.mainDiv.appendChild(titleDiv);

    //Create play button
    this.playButtonDiv = document.createElement('div');
    this.playButtonDiv.className = 'PlayButton';
    this.playButtonDiv.innerText = 'Play';
    this.playButtonDiv.addEventListener('click', ()=>{this.playButtonClicked();});
    this.mainDiv.appendChild(this.playButtonDiv);
  }

  /**
   * Handles play button click.
   */
  playButtonClicked() {
    this.breakOutGame.switchToGamePage();
  }

  /**
   * Called when the title page is shown.
   */
  show() {
  }

  /**
   * Called when the title page is hidden.
   */
  hide() {

  }

  /**
   * Returns the main div of the title page.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}
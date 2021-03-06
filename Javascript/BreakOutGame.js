import {GamePage} from "./Pages/GamePage.js";
import {TitlePage} from "./Pages/TitlePage.js";
import {Utility} from "./Utility.js";

export class BreakOutGame {
  constructor() {
    this.currentPage = null;
    this.titlePage = new TitlePage(this);
    this.gamePage = new GamePage(this);

    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'BreakOutGame';
  }

  /**
   * Switches to the title page.
   */
  switchToTitlePage() {
    if (this.currentPage !== null) {
      this.currentPage.hide();
    }
    Utility.RemoveElements(this.mainDiv);
    this.mainDiv.appendChild(this.titlePage.getDiv());
    this.currentPage = this.titlePage;
    this.titlePage.show();
  }

  /**
   * Switches to the game page.
   */
  switchToGamePage() {
    if (this.currentPage !== null) {
      this.currentPage.hide();
    }
    Utility.RemoveElements(this.mainDiv);
    this.mainDiv.appendChild(this.gamePage.getDiv());
    this.currentPage = this.gamePage;
    this.gamePage.show();
  }

  /**
   * Called when the game is shown.
   */
  show() {
    this.switchToTitlePage();
  }

  /**
   * Returns the main div of the game.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}
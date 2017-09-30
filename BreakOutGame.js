var breakOutGame = null;

/** @function main
 * Entry point to the program.
 * Starts the game.
 */
function main() {
  breakOutGame = new BreakOutGame();
  document.body.appendChild(breakOutGame.getDiv());
  breakOutGame.show();
}

//Initializes the game
window.onload = function () {
  main();
};
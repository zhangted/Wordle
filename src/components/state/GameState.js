import { Keyboard } from '../render/Keyboard';

export class GameState {
    constructor(cols, letterDict) {
        this.curTry = 0;
        this.maxTries = cols;

        this.gameWon = false;
        this.gameOver = false;

        this.keyboard = new Keyboard(letterDict);
        this.keyboard.render();
    }
    update = (word, userInputWord) => {
        this.curTry += 1;
        const evaluateAttempt = this.evaluateAttempt();
        if(evaluateAttempt) {
            this.gameWon ||= this.userInputWordMatchesCurWord(word, userInputWord);
            console.log(word, userInputWord)
            this.gameOver ||= (this.gameWon || this.lastAttempt());
        }
    }
    userInputWordMatchesCurWord = (word, userInputWord) => word === userInputWord;
    evaluateAttempt = () => this.curTry <= this.maxTries;
    lastAttempt = () => this.curTry === this.maxTries;
    renderKeyboard = () => this.keyboard.render();
}
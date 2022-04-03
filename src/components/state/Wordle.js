import { wordsString } from '../data/words';

export class Wordle {
    constructor(popupMsgNode, methods=undefined, id = undefined) {
        this.methods = methods;

        this.id = this.setId(id);
        this.words = this.getWords(wordsString);
        this.word = this.getWord();

        this.popupMsg = popupMsgNode;
    }
    setId = (id) => {
        if(id === undefined) {
            return this.generateId();
        }
        return id;
    }
    generateId = () => {
        return Math.random().toString(36).substring(2,8);
    }
    getWords = (wordsString) => {
        try {
            const words = JSON.parse(wordsString);
            return words;
        } catch (error) {
            console.error(error);
        };
        return false;
    }
    getWord = () => {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        const { length } = this.words;
        const idx = getRandomInt(length);
        return this.words[idx];
    }
    startGame = async() => {
        this.board = await import('../render/WordleBoard').then((module) => {
            return new module.WordleBoard(this.popupMsg, this.words, this.word, 5, 6, this.methods);
        });
        this.board.render();
        console.log(this.board);
    }
    resetGame = async() => {
        this.word = this.getWord();
        await this.startGame();
    }
}
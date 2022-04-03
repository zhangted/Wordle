import '../styles/WordleBoard.scss';

import { GameState } from "../state/GameState";

export class WordleBoard {
    constructor(popupMsgNode, validWords, word, width, tries, methods=undefined) {
        const { createNode, setStyle, prependApp } = methods;
        if(createNode) this.createNode = createNode;
        if(setStyle) this.setStyle = setStyle;
        if(prependApp) this.prependApp = prependApp;

        this.alphabet = this.getAlphabet();
        this.wordAsDict = this.getWordAsDict(word);
        this.word = word;
        this.validWords = validWords;
        this.rows = tries;
        this.cols = width;

        this.previousGrids = [];
        this.grid = this.createGrid(tries, width);
        this.curRow = 0;
        this.curCol = 0;

        this.popupMsg = popupMsgNode;
        
        this.letterDict = { softMatch: {}, hardMatch: {}, noMatch: {} };
        this.gameState = new GameState(tries, this.letterDict);
        this.inputEnabled = true;
        this.createEventListeners();
    }
    getAlphabet = () => {
        const lowerAlphabet = 'abcdefghijklmnopqrstuvwxyz';
        const upperAlphabet = lowerAlphabet.toUpperCase();
        return [lowerAlphabet, upperAlphabet].join('');
    }
    getWordAsDict = (word) => {
        // Params: word. Return: word as a counted dictionary.
        const dict = {};
        for(const idx in word) {
            const letter = word[idx];
            if(dict[letter]) {
                dict[letter] += 1;
            } else {
                dict[letter] = 1;
            }
        }
        return dict;
    };
    getCurRowInput = () => this.grid[this.curRow].join('');
    createGrid = (rows, cols) => {
        // Params: rows, cols. Return: grid of rows x cols.
        const grid = [];
        for(let row = 0; row < rows; row += 1) {
            const curRow = [];
            for(let col = 0; col < cols; col += 1) {
                curRow.push(' ');
            }
            grid.push(curRow);
        }
        return grid;
    };
    createEventListeners = () => {
        window.addEventListener('keydown', (event) => {
            if(!this.inputEnabled) return;
            const { key } = event;
            let shakeRow, flipRow;
            if(key === 'Enter') {
                const curWord = this.getCurRowInput();
                const fullRow = (this.curCol === this.cols);
                const validWord = this.validWords.includes(curWord);
                const invalidWord = !(validWord);
                if(fullRow && invalidWord) {
                    this.injectPopupMsg('invalid-word');
                    shakeRow = this.curRow;
                }
                else if(fullRow && validWord) {
                    const userInputWord = this.getCurRowInput();
                    this.gameState.update(this.word, userInputWord);
                    flipRow = this.curRow;
                    this.curRow += 1;
                    this.curCol = 0;
                } else {
                    this.injectPopupMsg('non-full-row');
                    shakeRow = this.curRow;
                }
            } else if(key === 'Backspace') {
                this.curCol -= 1;
                if(this.curCol < 0) this.curCol = 0;
                this.populateRow(' ', this.curRow, this.curCol, { backspace: true });
            } else if(this.alphabet.indexOf(key) !== -1) {
                this.populateRow(key, this.curRow, this.curCol);
            }

            const evaluateInputStateForPopupMsg = () => {
                const { gameOver, gameWon } = this.gameState;
                this.inputEnabled = !gameWon && !gameOver;
                if(gameWon && gameOver) this.injectPopupMsg('winner');
                else if(!gameWon && gameOver) this.injectPopupMsg('game-over');
            };

            evaluateInputStateForPopupMsg();

            this.render(shakeRow, flipRow);
        });
    };
    injectPopupMsg = (msg) => {
        if(!msg) return;

        const setPopupMsg = (msg) => {
            this.popupMsg.textContent = msg;
            this.setStyle(this.popupMsg, { padding: '10px', opacity: '92%' });
        };
        const fadePopupMsg = (popupMsgNode, curRow) => {
            popupMsgNode.textContent = '';
            this.setStyle(this.popupMsg, { opacity: '0%' });
            const gridRowNode = document.getElementsByClassName('wordle-grid_row')[curRow];
            if(gridRowNode) {
                gridRowNode.classList.remove('shake');
            }
        };
        const fadePopupMsgIn = (ms) => setTimeout(() => fadePopupMsg(this.popupMsg, this.curRow), ms);

        switch (msg) {
            case 'non-full-row': 
                setPopupMsg('word not long enough');
                fadePopupMsgIn(1000);
                break;
            
            case 'invalid-word':
                setPopupMsg('word does not exist');
                fadePopupMsgIn(1000);
                break;

            case 'winner':
                const winMsgs = ['you won dood!!!', 'winner winner chicken dinner'];
                const winMsgIndex = Math.floor(Math.random() * winMsgs.length);
                setPopupMsg(winMsgs[winMsgIndex]);
                const fireworksNodeProps = { 
                    innerHTML: `<div class="pyro"><div class="before"></div><div class="after"></div></div>`,
                    className: 'fireworks',
                };
                const fireworksNode = this.createNode('div', fireworksNodeProps);
                this.prependApp(fireworksNode);

                const winnerResetButton = this.getResetGameButton(fireworksNode, { params: this.popupMsg, fn: fadePopupMsg })
                this.popupMsg.appendChild(winnerResetButton);
                break;
            
            case 'game-over':
                setPopupMsg('game over =(');
                const gameOverResetButton = this.getResetGameButton(undefined, { params: this.popupMsg, fn: fadePopupMsg })
                this.popupMsg.appendChild(gameOverResetButton);
                break;
        
            default:
                break;
        }
    }
    getResetGameButton = (fireworksNode, functionAndParams = {}) => {
        const resetButtonProps = { className: 'reset-button', textContent: 'Reset' };
        const resetButton = this.createNode('button', resetButtonProps);
        resetButton.addEventListener('click', () => {
            if(fireworksNode) fireworksNode.remove();
            const { params, fn } = functionAndParams;
            console.log(params, fn)
            if(params && fn) fn(params);
            resetButton.remove();
            if(window.Wordle) window.Wordle.resetGame();
        });
        return resetButton;
    };
    populateRow = (key, rowIdxParam, colIdxParam, options = {}) => {
        if(rowIdxParam < this.rows && colIdxParam < this.cols) {
            this.previousGrids.push(this.grid)
            this.grid = this.grid.map(function(row, rowIdx) {
                return row.map(function(col, colIdx) {
                    if(rowIdx === rowIdxParam && colIdx === colIdxParam) return key.toLowerCase();
                    return col;
                });
            });
            const { backspace } = options;
            if(!backspace) this.incrCol();
        }
    }
    decrCol = () => {
        if(this.col - 1 > 0) {
            this.curCol -= 1;
            this.grid[row][col] = ' ';
        }
    }
    incrCol = () => {
        this.curCol += 1;
        if(this.curCol > this.cols) {
            this.curCol -= 1;
        }
    }
    renderCell = (row, col, letter, wordAsDict, shouldSpinCell) => {
        const cellClass = ['wordle-grid_row_element'];
        if(shouldSpinCell) cellClass.push('flip');
        if(row < this.curRow) {
            const letterInWord = wordAsDict[letter];
            if(letterInWord) {
                const letterInWordAndAtCorrectPosition = letter === this.word[col];
                const cellColorClass = letterInWordAndAtCorrectPosition ? 'evaluated-row-match' : 'evaluated-row-soft-match';
                letterInWordAndAtCorrectPosition ? this.letterDict.hardMatch[letter] = true : this.letterDict.softMatch[letter] = true;
                cellClass.push(cellColorClass);

                wordAsDict[letter] -= 1;
                if(wordAsDict[letter] === 0) {
                    delete wordAsDict[letter];
                }
            } else {
                cellClass.unshift('evaluated-row-no-match');
                this.letterDict.noMatch[letter] = true;
            }
        } else if(row > this.curRow) {
            cellClass.push('unevaluated-row');
        }
        if(row === this.curRow && col == this.curCol) cellClass.push('current-cell');
        return `<div class='${cellClass.join(' ')}'>${letter.toUpperCase()}</div>`
    }
    render = (shakeRow = undefined, flipRow = undefined) => {
        const html = ["<div class='wordle-grid'>"];
        for(let row = 0; row < this.rows; row += 1) {
            const rowWrapper = (shakeRow === row) ? "<span class='wordle-grid_row shake'>" : "<span class='wordle-grid_row'>";
            const wordAsDict = JSON.parse(JSON.stringify(this.wordAsDict));
            html.push(rowWrapper);
            const shouldSpinCell = (flipRow === row)
            for(let col = 0; col < this.cols; col += 1) {
                const letter = this.grid[row][col];
                const cell = this.renderCell(row, col, letter, wordAsDict, shouldSpinCell);
                html.push(cell);
            }
            html.push('</span>');
        }
        html.push('</div>');
        document.getElementById('board').innerHTML = html.join('');
        this.gameState.renderKeyboard();
    }
}
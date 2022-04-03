import '../styles/Keyboard.scss';

export class Keyboard {
    constructor(letterDict) {
        this.keyboardNode = document.getElementById('keyboard');
        this.iter = 0;

        this.letterDict = letterDict;

        this.keyboardStruct = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    }
    addOnScreenKeyboardListeners() {
        const keyNodes = this.keyboardNode.querySelectorAll('.key, .key-enter');
        keyNodes.forEach((keyNode) => {
            const key = keyNode.dataset.key;
            keyNode.addEventListener('click', () => {
                const keyboardEvent = new KeyboardEvent('keydown', { key: key });
                window.dispatchEvent(keyboardEvent);
            });
        });
    };
    render() {
        const [lastKeyboardRow] = this.keyboardStruct.slice(-1);
        const enterKeyHtml = `<span class='key' data-key='Enter' style='width:60px;'>Enter</span>`;
        const backspaceKeyHtml = `<span class='key' data-key='Backspace'>⌫</span>`;

        const getKeyBgColorCssClass = (letter) => {
            const letterCssClass = ['key'];
            if(this.letterDict.hardMatch[letter]) {
                letterCssClass.push('evaluated-row-match');
            } else if(this.letterDict.softMatch[letter]) {
                letterCssClass.push('evaluated-row-soft-match');
            } else if(this.letterDict.noMatch[letter]) {
                letterCssClass.push('evaluated-row-no-match');
            }
            return letterCssClass.join(' ');
        }

        const html = [];
        for(const idx in this.keyboardStruct) {
            const row = this.keyboardStruct[idx];
            const rowHtml = (row === lastKeyboardRow) ? [enterKeyHtml] : [];
            for(const stringIdx in row) {
                const letter = row[stringIdx];
                const upperCaseLetter = letter.toUpperCase();
                const letterCssClass = getKeyBgColorCssClass(letter);
                const letterHtml = `<span class='${letterCssClass}' data-key=${upperCaseLetter}>${upperCaseLetter}</span>`;
                rowHtml.push(letterHtml);
            }
            if(row === lastKeyboardRow) rowHtml.push(backspaceKeyHtml);

            const fullRowHtml = `<section class="key-row">${rowHtml.join('')}</section>`;
            html.push(fullRowHtml);
        }
        this.keyboardNode.innerHTML = html.join('');
        this.addOnScreenKeyboardListeners();
    }
}
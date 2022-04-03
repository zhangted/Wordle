import "./components/styles/first-paint.scss";

const app = document.getElementById('app');
const prependApp = (node) => app.prepend(node);

import('./components/helpers').then(async (module) => {
    const { createNode, setStyle } = module.helpers;
    const methods = { createNode, setStyle, prependApp };

    // Popup Message
    const popupMsgProps = { id: 'popup' };
    const popupMsgNode = createNode('div', popupMsgProps);
    app.appendChild(popupMsgNode);

    // Menu
    await import('./components/render/Menu').then((module) => {
        const menuProps = { id: 'menu', textContent: 'this is the menu' };
        const menuNode = createNode('div', menuProps);
        const menuInstance = new module.Menu(menuNode, methods);
        menuInstance.render();
        app.appendChild(menuNode);
    });

    // Wordle Board
    const boardProps = { id: 'board', textContent: 'this is the board' };
    const boardNode = createNode('div', boardProps);
    app.appendChild(boardNode);

    // On-screen Keyboard
    const keyboardProps = { id: 'keyboard', textContent: 'this is the keyboard' };
    const keyboardNode = createNode('div', keyboardProps);
    app.appendChild(keyboardNode);

    // Game
    await import('./components/state/Wordle').then(async(module) => {
        const wordleInstance = new module.Wordle(popupMsgNode, methods);
        wordleInstance.startGame();
        window.Wordle = wordleInstance;

        // Wordle Keystroke History Modal
        await import('./components/render/WordleBoardHistory').then((module) => {
            const wordleHistoryProps = { id: 'wordleHistory' };
            const wordleHistoryModal = createNode('div', wordleHistoryProps);
            app.appendChild(wordleHistoryModal);
            new module.WordleBoardHistory(wordleInstance, wordleHistoryModal, methods);
        });
    });

});
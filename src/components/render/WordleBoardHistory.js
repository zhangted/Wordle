import '../styles/WordleBoardHistory.scss';

export class WordleBoardHistory {
    constructor(wordleInstance, modalNode, methods=undefined) {
        const { createNode, setStyle } = methods;
        this.createNode = createNode;
        this.setStyle = setStyle;

        this.closeModalButton = this.getCloseModalButton();
        this.refreshModalButton = this.getRefreshModalButton();

        this.wordleInstance = wordleInstance;
        this.modal = modalNode;
        this.active = false;
        this.addEventListeners();
    }
    getCloseModalButton = () => {
        const closeButtonProps = { textContent: '❌', className: 'closeButton' };
        const closeButton = this.createNode('button', closeButtonProps);
        closeButton.addEventListener('click', () => {
            const showHistoryEvent = new Event('menu:show-history')
            window.dispatchEvent(showHistoryEvent);
        })
        return closeButton;
    };
    getRefreshModalButton = () => {
        const refreshButtonProps = { textContent: '🔁', className: 'closeButton' };
        const refreshButton = this.createNode('button', refreshButtonProps);
        refreshButton.addEventListener('click', () => this.render());
        return refreshButton;
    }
    render = () => {
        const { board } = this.wordleInstance;
        const { previousGrids, grid } = board;
        const previousTenGrids = previousGrids.slice(-9);
        previousTenGrids.push(grid);

        const html = [''];

        previousTenGrids.map((inputSnapshot) => {
            const snapshotHTML = [];
            inputSnapshot.map((rowSnapshot) => {
                const rowSnapshotArr = ['']
                rowSnapshot.map((cellSnapshot) => {
                    const cellItem = (cellSnapshot === ' ') ? '-': cellSnapshot;
                    const cellHtml = `<span class='history-cell'>${cellItem}</span>`;
                    rowSnapshotArr.push(cellHtml);
                });
                const rowSnapshotString = rowSnapshotArr.join('');
                if(rowSnapshotString) snapshotHTML.push(`${rowSnapshotString}<br>`);
            });
            html.push(`<div>${snapshotHTML.join('')}</div>`);
            // if(gridIdx < previousTenGrids.length-1) 
            html.push('<div>→<br>→<br>→<br>→<br>→<br>→</div>');
        });

        html.push('');
        this.modal.innerHTML = html.join('');
        this.modal.appendChild(this.closeModalButton);
        this.modal.appendChild(this.refreshModalButton);
        this.setStyle(this.modal, { padding: '10px' });
        this.active = true;
    };
    destroyRender = () => {
        this.modal.innerHTML = '';
        this.setStyle(this.modal, { padding: '0px' });
        this.active = false;
    };
    addEventListeners = () => {
        window.addEventListener('menu:show-history', () => {
            const { board } = this.wordleInstance;
            board.inputEnabled = !board.inputEnabled;
            (this.active) ? this.destroyRender() : this.render();
        });
    };
}
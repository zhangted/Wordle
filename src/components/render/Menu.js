import '../styles/Menu.scss';

import { colorSet } from "../data/ColorSet";

export class Menu {
    constructor(menuNode, methods=undefined) {
        this.root = menuNode;
        this.lastColorSet = 'dark';
    }
    attachFunctions = (menuNode) => {
        const [toggleThemeNode] = menuNode.getElementsByClassName('menu-toggleTheme');
        toggleThemeNode.addEventListener('click', () => {
            let colorProps;
            if(this.lastColorSet === 'dark') {
                colorProps = colorSet.light;
                this.lastColorSet = 'light';
            } else {
                colorProps = colorSet.dark;
                this.lastColorSet = 'dark';
            }
            for(const prop in colorProps) {
                if(prop) document.documentElement.style.setProperty(prop, colorProps[prop]);
            }
        });

        const [toggleHistoryNode] = menuNode.getElementsByClassName('menu-toggleHistory');
        toggleHistoryNode.addEventListener('click', () => {
            const showHistoryEvent = new Event('menu:show-history')
            window.dispatchEvent(showHistoryEvent);
        });

        const [showInstructionsBtn] = menuNode.getElementsByClassName('menu-toggleInstruction');
        showInstructionsBtn.addEventListener('click', () => {
            // implement instructions
        });

    }
    render = () => {
        const viewHistoryBtn = "<span class='menu-toggleHistory'>📜</span>";
        const toggleThemeBtn = "<span class='menu-toggleTheme'>💡</span>";
        const showInstructionsBtn = "<span class='menu-toggleInstruction'>❓</span>";
        const header = "<span class='menu-title'>Wordle</span>";
        const html = [header, toggleThemeBtn,  viewHistoryBtn, showInstructionsBtn ];
        this.root.innerHTML = html.join('');
        this.attachFunctions(this.root);
    }
}
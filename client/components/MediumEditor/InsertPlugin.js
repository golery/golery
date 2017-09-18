import styles from './InsertPlugin.css';

export default class InsertPlugin {
    constructor(elmHolder, elmContent) {
        this.elmHolder = elmHolder;
        this.elmContent = elmContent;


        let e = document.createElement('div');
        e.innerHTML = '<div>++Button++</div>';
        let elmButton = e.firstChild;
        elmHolder.appendChild(elmButton);

        elmButton.className = styles.menuButton;
        elmButton.addEventListener('mousedown', (e) => this._onClick(e));
    }

    _onClick(e) {
        console.log('click');

        // don't take focus from editor
        e.stopPropagation();
        e.preventDefault();
    }
}
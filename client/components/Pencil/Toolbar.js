import React from 'react';

import styles from './Toolbar.css';

/**
 * Toolbar component
 * @param commands List of commands
 * @param themeLight = true: use light color */
export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttons = this.props.commands.map((v, i) => {
            return <span className={`${styles.button} ${v.className}`} key={i}
                         onMouseDown={(e) =>{
                             e.preventDefault();
                             e.stopPropagation();
                             v.onClickListener(e);
                         }}/>
        });
        let componentClassName = styles.component;
        if (this.props.themeLight) componentClassName += ' ' + styles.themeLight;
        return <div className={componentClassName}>
            {buttons}
        </div>;
    }

    /** @deprecated Replaced by createCommand */
    static addCommand(commands, thiz, text, onClickListener, className) {
        return commands.push({
            text,
            onClickListener: onClickListener.bind(thiz),
            className: className ? className : ''
        });
    }

    static createCommand(thiz, text, onClickListener, className) {
        return {
            text,
            onClickListener: onClickListener.bind(thiz),
            className: className ? className : ''
        };
    }
}

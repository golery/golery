import React from 'react';
import PropTypes from 'prop-types';

import styles from './EditorToolbar.scss';

export default class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttons = this.props.commands.map((v, i) => {
            return <span className={`${styles.button} ${v.className}`} key={i}
                         onMouseDown={(e) => {
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

    _buildToolbarCommands() {
        let map = this._buildToolbarCommandMap();
        let commands = [];
        let commandIds = this.props.toolbar || ['header', 'bold', 'italic', 'underline', 'clearFormat', 'number', 'bullet', 'indent', 'outdent', 'image'];
        for (let commandId of commandIds) {
            let command = map[commandId];
            if (command) {
                commands.push(command);
            }
        }
        return commands;
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

EditorToolbar.propTypes = {
    //node: PropTypes.object
};

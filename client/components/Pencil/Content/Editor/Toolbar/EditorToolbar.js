import React from 'react';
import PropTypes from 'prop-types';

import styles from './EditorToolbar.scss';

export default class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);
        this._cssClass = {
            'header': 'fa fa-header',
            'bold': 'fa fa-bold',
            'italic': 'fa fa-italic',
            'underline': 'fa fa-underline',
            'clearFormat': 'fa fa-eraser',
            'number': 'fa fa-list-ol',
            'bullet': 'fa fa-list-ul',
            'indent': 'fa fa-indent',
            'outdent': 'fa fa-outdent',
            'image': 'fa fa-image',
            'code': 'fa fa-code',
            'share': 'fa fa-share-alt',
        }
    }

    render() {
        let {toolbarController} = this.props;
        let commands = toolbarController.getActions();
        console.log(commands);
        let buttons = commands.map((action, i) => {
            return <span className={`${styles.button} ${this._getButtonCssClass(action)}`} key={i}
                         onMouseDown={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             toolbarController.fireAction(action);
                         }}/>
        });
        let componentClassName = styles.component;
        // if (this.props.themeLight) componentClassName += ' ' + styles.themeLight;

        return <div className={componentClassName}>
            {buttons}
        </div>;
    }

    _getButtonCssClass(action) {
        return this._cssClass[action];
    }
}

EditorToolbar.propTypes = {
    toolbarController: PropTypes.object
};

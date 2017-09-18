import React from 'react';

import styles from './TreeActionButtons.css';

class Button extends React.Component {
    render() {
        let {action} = this.props;
        return <div className={styles.buttonHolder}>
            <div className={styles.button}
                 onClick={() => {
                     console.log(action.onClick);
                     action.onClick();
                 }}>
                <div className={action.className}/>
            </div>
        </div>;
    }
}

export default class TreeActionButtons extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        let {actions} = this.props;
        let buttonElms = actions.map((action, i) => <Button key={i} action={action}/>);
        return <div className={styles.component}>{buttonElms}
        </div>;
    }
}

TreeActionButtons.propTypes = {
    //options: PropTypes.array
};

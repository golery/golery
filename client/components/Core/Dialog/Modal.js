import React from 'react';
import styles from './Modal.css';

/**
 * @param isOpen : boolean
 * @param closeListener : close listener*/
export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    render() {
        if (this.props.isOpen === false)
            return null;

        return (
            <div>
                <div className={styles.modal}>{this.props.children}
                    <div className={styles.close} onClick={this.close}>&#10006;</div>
                </div>
                <div className={styles.backdrop} onClick={this.close}/>
            </div>
        );
    }

    close(e) {
        e.preventDefault();

        if (this.props.closeListener) {
            this.props.closeListener();
        }
    }
}

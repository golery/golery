import React from 'react';

import styles from './Scrollbar.scss';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <SimpleBar {...this.props} className={styles.scrollbar}>
            {this.props.children}
        </SimpleBar>;
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};

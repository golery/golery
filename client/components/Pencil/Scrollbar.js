import React from 'react';

import styles from './Scrollbar.scss';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

/**
 * Due to implementation of simblebar, Scrollbar needs to be placed inside an element with
 * - position: relative
 * - no padding, no margin
 * */
export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /** Scrollbar needs an element with height. Flex element does not have height.
         * We need an extra div (scrollbarFixHeight) to remove the flex auto height.
         * This fix works only if the parent element of scrollbar has position: relative */
        return (<div className={styles.scrollbarFixHeight}>
            <SimpleBar {...this.props} className={styles.scrollbar}>
                {this.props.children}
            </SimpleBar>
        </div>);
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};

import React from 'react';

import styles from './menu.css';
export default class MenuView extends React.Component {
    componentDidMount() {

    }
    render() {
        return <div className={styles.component}>
            <div className={styles.header}>Ốc</div>
            <div className={styles.main}><img className={styles.image} src="/www2/images/food/snail.jpg"/></div>
            <div className={styles.header}>Bánh canh</div>
            <div className={styles.main}><img className={styles.image} src="/www2/images/food/banh-canh.jpg"/></div>
        </div>;
    }
}

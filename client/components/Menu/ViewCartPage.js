import styles from "./ViewCartPage.scss";

import React from "react";
import {MenuItem, MenuItemAddOn, MenuItemAddOnGroup} from "./Model";

// https://www.ubereats.com/austin/food-delivery/amys-ice-creams-6th/vOpT4x_UTDilQJYOCVdOaQ/
export default class ViewCartPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return <div className={styles.component}>
            <div>When arrive at counter / the waiter come to you, click Request then confirm the code with the waiter.
                (Don't click on request until it's your turn)
                <div><div className={styles.code}>XAB123</div></div>
                <div className={styles.button}>Request</div>
                <div className={styles.button} onClick={()=>this.props.onCancel()}>Cancel</div>
            </div>
        </div>;
    }
}
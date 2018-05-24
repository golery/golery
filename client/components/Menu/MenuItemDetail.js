import styles from "./MenuItemDetail.scss";

import React from "react";
import {MenuItem, MenuItemAddOn, MenuItemAddOnGroup} from "./Model";

// https://www.ubereats.com/austin/food-delivery/amys-ice-creams-6th/vOpT4x_UTDilQJYOCVdOaQ/
export default class MenuItemDetail extends React.Component {
    constructor(props) {
        super(props);
    }


    _buildElmAddOn(addOn) {
        return <div className={styles.addOnHolder}>
            <div className={styles.addOnName}>{addOn.name}</div>
            <div className={styles.addOnPrice}>+{addOn.price}$</div>
        </div>;
    }

    _buildElmAddOnGroup(group) {
        return <div>
            <div className={styles.addOnGroupName}>{group.name}</div>
            {group.addOns.map((addOn) => {
                return this._buildElmAddOn(addOn);
            })}
        </div>;
    }

    render() {
        let item = this.props.item;
        let elmAddOn = !item.addOnGroups ? null :
            <div>
                {item.addOnGroups.map((group) => {
                    return this._buildElmAddOnGroup(group)
                })}
            </div>;
        return <div className={styles.component}>
            <div><img className={styles.headerImage} src={item.smallImage}/></div>
            <div className={styles.holder}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.description}>{item.description}</div>
                {elmAddOn}
                <div>
                    <div>Special Instructions</div>
                    <div><input className={styles.inputSpecialInstruction} type='text'
                                placeholder='Add note (ex: extra sauce)'/></div>
                </div>
                <div className={styles.addRemoveHolder}>
                    <div className={styles.circle}>-</div>
                    <div className={styles.quantity}>1</div>
                    <div className={styles.circle}>+</div>
                </div>
                <div className={styles.button} onClick={() => this.props.onClose()}>CLOSE</div>
            </div>
        </div>;
    }
}
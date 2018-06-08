import styles from "./MenuPage.scss";

import React from "react";
import MenuItemDetail from "./MenuItemDetail";
import {MenuItem, MenuItemAddOn, MenuItemAddOnGroup} from "./Model";
import ViewCartPage from "./ViewCartPage";

// https://www.ubereats.com/austin/food-delivery/amys-ice-creams-6th/vOpT4x_UTDilQJYOCVdOaQ/
export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedItem: null, viewCart: false};
        this.x = [];
    }

    _onClickItem(dish) {
        this.setState(prev => {
            return {selectedItem: this.x[0]};
        });
    }

    _onCloseItem() {
        this.setState(() => {
            return {selectedItem: null}
        });
    }

    _onViewCart() {
        this.setState(() => { return {
            viewCart:true
        }});
    }

    _getSample() {
        let addOn1 = new MenuItemAddOn({id: '1', name: '24 Birthday Candles (White)', price: 1});
        let addOn2 = new MenuItemAddOn({id: '1', name: '24 Birthday Candles (Assorted Colors)', price: 1});
        let group = new MenuItemAddOnGroup({
            id: '1',
            name: 'Add-ons',
            addOns: [addOn1, addOn2],
            minItem: 0,
            maxItem: 2
        });
        let menuItem = new MenuItem({
            name: 'Mexican Vanilla',
            smallImage: 'https://duyt4h9nfnj50.cloudfront.net/sku/c452b94645b131855bb0d27ec60df5c7',
            description: 'Classic Oreo ice cream layered between moist chocolate cake and our decadent hot fudge, topped with a fluffy vanilla frosting, more hot fudge, and Oreo cookies. 3" serves 2-4.',
            addOnGroups: [group]
        });
        return menuItem;

    }

    render() {
        this.x = [
            this._getSample(), {
                name: 'Classic Oreo Tiny Cake',
                smallImage: 'https://duyt4h9nfnj50.cloudfront.net/sku/7d53fe94da0e9afc92b3c2daee425b6b'
            },
            {
                name: 'Belgian Chocolate & Chocolate Chip Cookie',
                smallImage: 'https://duyt4h9nfnj50.cloudfront.net/sku/3d45093b0617ed7fdbe733e3cfd03302'
            },
            {
                name: 'Coffee',
                smallImage: 'https://duyt4h9nfnj50.cloudfront.net/sku/31727941a948a2266f55b0056d4b6353'
            }
        ];
        let elmViewCartButton = <div className={styles.viewCartHolder} onClick={() => this._onViewCart()}>
            <div>View cart</div>
        </div>;
        let elmItemList = <div>{this.x.map(dish => <div key={dish.name} className={styles.holder}>
            <div className={styles.cardHolder} onClick={() => this._onClickItem(dish)}>
                <img className={styles.smallImage} src={dish.smallImage}/>
                <div className={styles.nameHolder}>{dish.name}</div>
            </div>
        </div>)}
            {elmViewCartButton}
        </div>;

        // this.state.selectedItem = this.x[0];
        let elmItemDetail = <div><MenuItemDetail item={this.state.selectedItem} onClose={() => this._onCloseItem()}/>
        </div>;
        let main = this.state.selectedItem ? elmItemDetail : elmItemList;
        if (this.state.viewCart) {
            main = <ViewCartPage onCancel={()=>this.setState(()=>({viewCart:false}))}/>;
        }
        return <div className={styles.component}>{main}
        </div>;
    }
}
class MenuItemAddOn {
    constructor({id, name, price}) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
class MenuItemAddOnGroup {
    constructor({id, name, addOns, minItem, maxItem}) {
        this.id = id;
        this.name = name;
        this.addOns = addOns;
        this.minItem = minItem;
        this.maxItem = maxItem;
    }
}
class MenuItem {
    constructor({id, name, description, smallImage, price, currency, addOnGroups}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.smallImage = smallImage;
        this.price = price;
        this.currency = currency;
        this.addOnGroups = addOnGroups;
    }
}

export {MenuItem, MenuItemAddOnGroup, MenuItemAddOn};
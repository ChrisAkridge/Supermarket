import Helpers from "./Helpers";

export default class Department {
    constructor(game,
            index,
            name,
            basePrice,
            priceMultiplier,
            satsPerLevel,
            productsPerCustomer,
            pricePerProduct,
            footprint) {
        this.helpers = new Helpers();
        this.game = game;   // ughhh spaghetti dependencies
        this.index = index;
        this.name = name;
        this.price = basePrice;
        this.priceMultiplier = priceMultiplier;
        this.satsPerLevel = satsPerLevel;
        this.productsPerCustomer = productsPerCustomer;
        this.pricePerProduct = pricePerProduct;
        this.footprint = footprint;

        this.level = 0;
        this.customersPerSecond = 0;
        this.revenuePerSecond = 0;
        this.text = {};
    }

    get sats() {
        return this.satsPerLevel * this.level;
    }

    tryLevelUp = () => {
        this.game.tryLevelDepartment(this.index);
    }

    levelUp() {
        this.level += 1;
        this.price *= this.priceMultiplier;
    }

    update() {
        this.text = this.getDisplayText();
    }

    getDisplayText() {
        return {
            name: this.name,
            level: `${this.level}`,
            cost: this.helpers.asCurrency(this.price),
            footprint: `${this.footprint}`,
            productsPerCustomer: `${this.productsPerCustomer}`,
            pricePerProduct: `${this.helpers.asCurrency(this.pricePerProduct)}`,
            customersPerSecond: `${this.customersPerSecond}`,
            revenuePerSecond: `${this.helpers.asCurrency(this.revenuePerSecond)}`
        };
    }
}
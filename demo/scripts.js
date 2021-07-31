class Game {
    constructor() {
        this.bank = 0;

        this.departments = [
            new Department('Food',
                100,
                1.15,
                1000,
                1,
                1,
                1,
                0.2)
        ];
    }
}

class Department {
    constructor(name,
        basePrice,
        priceMultiplier,
        footprint,
        baseSatsPerLevel,
        baseProductsPerCustomer,
        basePricePerProduct,
        saleEffectiveness) {
            this.name = name;
            this.basePrice = basePrice;
            this.priceMultiplier = priceMultiplier;
            this.footprint = footprint;
            this.baseSatsPerLevel = baseSatsPerLevel;
            this.satsPerLevel = baseSatsPerLevel;
            this.basePricePerProduct = basePricePerProduct;
            this.baseProductsPerCustomer = baseProductsPerCustomer;
            this.saleEffectiveness = saleEffectiveness;
            
            this.level = 0;
            this.price = basePrice;
            this.sats = 0;
            this.productsPerCustomer = baseProductsPerCustomer;
            this.pricePerProduct = basePricePerProduct;
        }

    levelUp() {
        this.level += 1;
        this.price *= this.priceMultiplier;
        this.sats += this.satsPerLevel;
    }
}
var siPrefixes = [
    { name: 'yocto', multiplier: 1e-24 },
    { name: 'zepto', multiplier: 1e-21 },
    { name: 'atto', multiplier: 1e-18 },
    { name: 'femto', multiplier: 1e-15 },
    { name: 'pico', multiplier: 1e-12 },
    { name: 'nano', multiplier: 1e-9 },
    { name: 'micro', multiplier: 1e-6 },
    { name: 'milli', multiplier: 1e-3 },
    { name: '', multiplier: 1 },
    { name: 'kilo', multiplier: 1e3 },
    { name: 'mega', multiplier: 1e6 },
    { name: 'giga', multiplier: 1e9 },
    { name: 'tera', multiplier: 1e12 },
    { name: 'peta', multiplier: 1e15 },
    { name: 'exa', multiplier: 1e18 },
    { name: 'zeta', multiplier: 1e21 },
    { name: 'yotta', multiplier: 1e24 },
];

var subscriptDigits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

function sum(array, selector) {
    let sum = 0;
    
    for (i in array) {
        const element = array[i];
        const value = selector(element);
        sum += value;
    }

    return sum;
}

function getDigits(number) {
    number = Math.trunc(number);

    var digits = [];
    const isNegative = number < 0;
    if (isNegative) {
        number = -number;
    }

    while (number >= 1) {
        const digit = number % 10;
        number /= 10;
        digits.unshift(digit);
    }

    return { isNegative: isNegative, digits: digits };
}

function roundToNearestMultiple(value, multipleOf) {
    if (value < 0) {
        return Math.ceil(value / multipleOf) * multipleOf;
    } else {
        return Math.floor(value / multipleOf) * multipleOf;
    }
}

function asCurrency(value) {
    return '$' + value.toFixed(2);
}

function asSI(value) {
    if (value === 0) {
        return "0 ";
    }

    const milliOrLower = value > -1 && value < 1;
    const maximalPrefixForValue = milliOrLower ? 'yocto' : 'yotta';
    const exponentAddend = milliOrLower ? 24 : -24;
    let orderOfMagnitude = Math.log10(value);
    let maximalPrefixLevel = 0;

    while (orderOfMagnitude <= -24 || orderOfMagnitude >= 24) {
        maximalPrefixLevel += 1;
        value *= Math.pow(10, exponentAddend);
        orderOfMagnitude += exponentAddend;
    }

    let maximalPrefix = '';
    if (maximalPrefixLevel !== 0) {
        const maximalPrefixDigits = getDigits(maximalPrefixLevel).digits;
        const maximalPrefixSubscript = maximalPrefixDigits.map(d => subscriptDigits[d]).join('');
        maximalPrefix = `${maximalPrefixForValue}${maximalPrefixSubscript}`;
    }

    const prefixIndex = Math.trunc(orderOfMagnitude / 3) + 8;
    const mantissaMultiplier = -roundToNearestMultiple(orderOfMagnitude, 3);
    const mantissa = value * Math.pow(10, mantissaMultiplier);

    return `${mantissa.toFixed(3)} ${siPrefixes[prefixIndex].name}${maximalPrefix}`;
}

class Game {
    constructor() {
        this.bank = 100;
        this.satisfaction = 0;
        this.customersPerSat = 1e9;
        this.customersPerSecond = 0;
        this.revenuePerSecond = 0;
        this.employees = 0;

        this.departments = [
            new Department(0, 'Food', 100, 1.15, 1e-9, 1, 1, 1000),
            new Department(0, 'General Merchandise', 1000, 1.15, 1e-8, 2, 1.5, 2000)
        ];
    }

    recalculate() {
        this.satisfaction = sum(this.departments, d => d.sats);
        this.customersPerSecond = this.customersPerSat * this.satisfaction;

        const totalLevels = sum(this.departments, d => d.level);
        const shareSize = this.customersPerSecond / totalLevels;

        for (const department of this.departments) {
            department.customersPerSecond = shareSize;
            department.revenuePerSecond = shareSize * department.productsPerCustomer * department.pricePerProduct;
            
            this.revenuePerSecond += department.revenuePerSecond;
        }
    }

    update(updateRate) {
        this.bank += this.revenuePerSecond * updateRate;
    }

    getDisplayText() {
        return [
            { id: 'bank', text: asCurrency(this.bank) },
            { id: 'satisfaction', text: `${asSI(this.satisfaction)}sats` },
            { id: 'customersPerSat', text: `${this.customersPerSat} customers/sat` },
            { id: 'customersPerSecond', text: `${this.customersPerSecond} customers/second` },
            { id: 'revenuePerSecond', text: `${asCurrency(this.revenuePerSecond)}/second` }
        ];
    }

    getDepartmentDisplayTexts() {
        return this.departments.map(d => d.getDisplayText());
    }

    tryLevelDepartment(index) {
        let department = this.departments[index];
        if (department.price > this.bank) { return; }

        this.bank -= department.price;
        department.levelUp();
        this.recalculate();
    }
}

class Department {
    constructor(index,
            name,
            basePrice,
            priceMultiplier,
            satsPerLevel,
            productsPerCustomer,
            pricePerProduct,
            footprint) {
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
    }

    get sats() {
        return this.satsPerLevel * this.level;
    }

    levelUp() {
        this.level += 1;
        this.price *= this.priceMultiplier;
    }

    getDisplayText() {
        return [
            { id: 'name', text: this.name },
            { id: 'level', text: `Level ${this.level}` },
            { id: 'cost', text: asCurrency(this.price) },
            { id: 'footprint', text: `Footprint: ${this.footprint} ft²` },
            { id: 'productsPerCustomer', text: `${this.productsPerCustomer} products/customer` },
            { id: 'pricePerProduct', text: `${asCurrency(this.pricePerProduct)}/product` }
        ];
    }
}

// HTML CODE

let game = new Game();

function render() {
    const gameText = game.getDisplayText();
    const departmentText = game.getDepartmentDisplayTexts();

    for (i in gameText) {
        $('#' + gameText[i].id).text(gameText[i].text);
    }

    for (let i = 0; i < departmentText.length; i++) {
        for (j in departmentText[i]) {
            $(`#department-${i}-${departmentText[i][j].id}`)
                .text(departmentText[i][j].text);
        }
    }
}

setInterval(() => {
    game.update(1 / 30);
    render();
}, 1 / 30);

$('#department-0').click(function() {
    game.tryLevelDepartment(0);
});
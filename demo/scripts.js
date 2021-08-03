function sum(array, selector) {
    let sum = 0;
    
    for (i in array) {
        const element = array[i];
        const value = selector(element);
        sum += value;
    }

    return sum;
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
            new Department(0, 'Food', 100, 1.15, 1e-9, 1, 1, 1000)
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
        this.bank += this.revenuePerSecond / updateRate;
    }

    getDisplayText() {
        return [
            { id: 'bank', value: this.bank },
            { id: 'satisfaction', value: this.satisfaction },
            { id: 'customersPerSat', value: this.customersPerSat },
            { id: 'customersPerSecond', value: this.customersPerSecond },
            { id: 'revenuePerSecond', value: this.revenuePerSecond }
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
            { id: 'name', value: this.name },
            { id: 'level', value: this.level },
            { id: 'cost', value: this.price },
            { id: 'footprint', value: this.footprint },
            { id: 'productsPerCustomer', value: this.productsPerCustomer },
            { id: 'pricePerProduct', value: this.pricePerProduct }
        ];
    }
}

// HTML CODE

let game = new Game();

function render() {
    const gameText = game.getDisplayText();
    const departmentText = game.getDepartmentDisplayTexts();

    for (i in gameText) {
        $('#' + gameText[i].id).text(gameText[i].value);
    }

    for (let i = 0; i < departmentText.length; i++) {
        for (j in departmentText[i]) {
            $(`#department-${i}-${departmentText[i][j].id}`)
                .text(departmentText[i][j].value);
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
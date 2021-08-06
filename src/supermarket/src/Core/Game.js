import Department from './Department.js';
import Helpers from './Helpers.js';

export default class Game {
    constructor() {
        this.helpers = new Helpers();
        this.bank = 100;
        this.satisfaction = 0;
        this.customersPerSat = 1e9;
        this.customersPerSecond = 0;
        this.revenuePerSecond = 0;
        this.employees = 0;

        this.departments = [
            new Department(this, 0, 'Food', 100, 1.15, 1e-9, 1, 1, 1000),
            new Department(this, 0, 'General Merchandise', 1000, 1.15, 1e-8, 2, 1.5, 2000)
        ];

        this.text = {};
    }

    recalculate() {
        this.satisfaction = this.helpers.sum(this.departments, d => d.sats);
        this.customersPerSecond = this.customersPerSat * this.satisfaction;

        const totalLevels = this.helpers.sum(this.departments, d => d.level);
        const shareSize = this.customersPerSecond / totalLevels;

        for (const department of this.departments) {
            department.customersPerSecond = shareSize;
            department.revenuePerSecond = shareSize * department.productsPerCustomer * department.pricePerProduct;
            
            this.revenuePerSecond += department.revenuePerSecond;
        }
    }

    update(updateRate) {
        this.bank += this.revenuePerSecond * updateRate;
        this.text = this.getDisplayText();

        for (const department of this.departments) {
            department.update();
        }
    }

    getDisplayText() {
        return {
            bank: this.helpers.asCurrency(this.bank),
            satisfaction: `${this.helpers.asSI(this.satisfaction)}sats`,
            customersPerSat: `${this.customersPerSat} customers/sat`,
            customersPerSecond: `${this.customersPerSecond} customers/second`,
            revenuePerSecond: `${this.helpers.asCurrency(this.revenuePerSecond)}/second`
        };
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
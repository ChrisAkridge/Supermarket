class DebugNumber {
    constructor(initialValue, debugName, groupPath) {
        this.valueField = initialValue;
        this.debugNameField = debugName ?? 'Computed Value';
        this.groupPathField = groupPath ?? '';

        this.onChangeField = () => {}
    }

    get value() {
        return this.valueField;
    }

    get debugName() {
        return this.groupPathField;
    }

    get groupNames() {
        const groupNames = this.groupPathField.split('>');
        return groupNames.map(n => n.trim());
    }

    get onChange() {
        return this.onChangeField;
    }

    set onChange(action) {
        this.onChangeField = action;
    }

    setValue(newValue) {
        this.valueField = newValue;
    }

    setValueAndInvoke(newValue) {
        this.valueField = newValue;
        this.onChangeField();
    }

    // Non-mutating mathematics
    addedTo(a, b) { return new NumberField(a.value + b.value); }
    subtractedFrom(a, b) { return new NumberField(a.value - b.value); }
    multipliedBy(a, b) { return new NumberField(a.value * b.value); }
    dividedBy(a, b) { return new NumberField(a.value / b.value); }
    random() { return new NumberField(Math.random()); }
    pow(base, power) { return new NumberField(Math.pow(base.value, power.value)); }
    min(a, b) { return (a.value <= b.value) ? a : b; }
    max(a, b) { }
    
    ratioMultipliedBy(percent, factor) {
        const complement = 1 - percent.value;
        const ratio = percent.value / complement;
        const newRatio = ratio * factor.value;
        const numberOfParts = newRatio + 1;
        const percentPerPart = 1 / numberOfParts;
        return new NumberField(percentPerPart * newRatio);
    }

    stddev(array) {
        // https://stackoverflow.com/a/53577159/2709212
        const n = array.length
        const mean = array.reduce((a, b) => a.value + b.value) / n
        const deviation = Math.sqrt(
            array.map(
                x => Math.pow(x - mean, 2)
            ).reduce((a, b) => a + b) / n);

        return new NumberField(deviation);
    }
}

class DebugGroup {
    constructor(groupName) {
        this.groupName = groupName;
        this.groups = [];
        this.numbers = [];
    }

    // add number to group

    getMatchingGroup(groupName) {
        return this.groups.find(g => g.groupName === groupName);
    }
}

class Game {
    constructor() {
        this.bank = new NumberField(0, 'Bank', 'Game');
        this.sats = new NumberField(0, 'Customer Satisfaction', 'Game');
        this.customersPerSat = new NumberField(0, 'Customers per Sat', 'Game');
        this.customersPerSatPerSecond = new NumberField(0, 'Customers per Sat per Second', 'Game');
        this.size = new NumberField(0, 'Store Size', 'Game');
        this.userName = '';
        this.storeName = '';
        this.seniorityStartedOn = new Date(2021, 7, 31, 10, 19, 0, 0);
        this.promotionStartedOn = new Date(2021, 7, 31, 10, 19, 0, 0);
        this.seniorityEarnings = new NumberField(0, 'Seniority Earnings', 'Game');
        this.promotionEarnings = new NumberField(0, 'Promotion Earnings', 'Game');
        this.departments = [];
        this.upgrades = [];
        this.customerService = {};
        this.inventoryAndPricing = {};
        this.customerAccidentOddsPerSecond = new NumberField(0, 'Customer Accidents Odds per Second', 'Game > Accidents');
        this.customerIncidentOddsPerSecond = new NumberField(0, 'Customer Incident Odds per Second', 'Game > Accidents');
        this.customerAccidentSatisfactionMultiplier = new NumberField(0, 'Customer Accident/Incident Satisfaction Multiplier', 'Game > Accidents');
        this.wageNegotiations = {};
        this.layoffInformation = {};
        this.bankruptcies = new NumberField(0, 'Bankruptcies', 'Game');
        this.promotionInformation = {};
    }

    get nonSaleCustomersPerSecond() {
        return this.customersPerSat.value * this.customersPerSatPerSecond.value;
    }
}
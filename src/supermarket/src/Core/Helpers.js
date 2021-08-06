export default class Helpers {
    constructor() {
        this.siPrefixes = [
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

        this.subscriptDigits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    }
    
    sum(array, selector) {
        let sum = 0;
        
        for (var i in array) {
            const element = array[i];
            const value = selector(element);
            sum += value;
        }
    
        return sum;
    }
    
    getDigits(number) {
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
    
    roundToNearestMultiple(value, multipleOf) {
        if (value < 0) {
            return Math.ceil(value / multipleOf) * multipleOf;
        } else {
            return Math.floor(value / multipleOf) * multipleOf;
        }
    }
    
    asCurrency(value) {
        return '$' + value.toFixed(2);
    }
    
    asSI(value) {
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
            const maximalPrefixDigits = this.getDigits(maximalPrefixLevel).digits;
            const maximalPrefixSubscript = maximalPrefixDigits.map(d => this.subscriptDigits[d]).join('');
            maximalPrefix = `${maximalPrefixForValue}${maximalPrefixSubscript}`;
        }
    
        const prefixIndex = Math.trunc(orderOfMagnitude / 3) + 8;
        const mantissaMultiplier = -this.roundToNearestMultiple(orderOfMagnitude, 3);
        const mantissa = value * Math.pow(10, mantissaMultiplier);
    
        return `${mantissa.toFixed(3)} ${this.siPrefixes[prefixIndex].name}${maximalPrefix}`;
    }
}
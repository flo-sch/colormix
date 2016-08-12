import Color from './Color';
import ColorSpace from './ColorSpace';

class ColorMix {

    constructor() {
        this.gradient = [{
            reference: 0,
            color: {
                red: 0,
                green: 0,
                blue: 0
            }
        }, {
            reference: 100,
            color: {
                red: 255,
                green: 255,
                blue: 255
            }
        }];

        return this;
    }

    mix (colors, percents) {
        if (typeof colors == 'undefined' || Object.prototype.toString.call(colors) != '[object Array]') {
            throw new Error('"ColorMix.mix()" first parameter should be an array of ColorMix.Color objects');
        }

        if (typeof percents == 'undefined') {
            percents = [];
            let i = colors.length;

            while (i--) {
                percents[i] = 100 / colors.length;
            }
        } else if (Object.prototype.toString.call(percents) != '[object Array]') {
            throw new Error('"ColorMix.mix()" second parameter should be an array of percents. (nnumber values)');
        }

        if (colors.length != percents.length) {
            throw new Error('"ColorMix.mix()" parameters should be arrays of the same size !');
        }

        let i = colors.length;
        let L = 0;
        let a = 0;
        let b = 0;
        let P = 0;

        while (i--) {
            if (!(colors[i] instanceof Color)) {
                throw new Error('"ColorMix.mix()" color at index: ' + i + ' should be an instance of ColorMix.Color() object !');
            }

            P += percents[i];

            if (P > 100) {
                throw new Error('Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.');
            }

            let Lab = ColorSpace.RGBtoLab(colors[i].getRed(), colors[i].getGreen(), colors[i].getBlue());

            L += Lab.L * percents[i] / 100;
            a += Lab.a * percents[i] / 100;
            b += Lab.b * percents[i] / 100;
        }

        if (P != 100) {
            throw new Error('Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.');
        }

        let RGB = ColorSpace.LabtoRGB(L, a, b);

        return new Color(RGB.red, RGB.green, RGB.blue);
    }

    setGradient (newGradient) {
        if (typeof newGradient != 'undefined' && Object.prototype.toString.call(newGradient) == '[object Array]') {
            this.gradient = newGradient;
        }

        return this;
    }

    getGradient () {
        return this.gradient;
    }

    blend (reference) {
        if (typeof reference == 'undefined') {
            throw new Error('Missing "ColorMix.blend()" first parameter.');
        }

        reference = parseInt(reference);

        if (isNaN(reference)) {
            throw new Error('Invalid "ColorMix.blend()" first parameter: you should provide a number.');
        }

        let l = this.gradient.length;
        let previous = this.gradient[0];
        let next = this.gradient[l - 1];

        // Get the color range (the closest steps of reference in the gradient)
        if (reference <= previous.reference) {
            return new Color(previous.color.red, previous.color.green, previous.color.blue);
        } else if (reference >= next.reference) {
            return new Color(next.color.red, next.color.green, next.color.blue);
        }

        while (l--) {
            let step = this.gradient[l];

            if (step.reference <= reference && step.reference > previous.reference) {
                previous = step
            } else if (step.reference >= reference && step.reference < next.reference) {
                next = step
            }
        }

        let C1 = new Color(previous.color.red, previous.color.green, previous.color.blue);
        let C2 = new Color(next.color.red, next.color.green, next.color.blue);

        // Calculate percentages
        previous.percent = Math.abs(100 / ((previous.reference - next.reference) / (reference - next.reference)));
        next.percent = 100 - previous.percent;

        // Mix the colors on LAB Color Space
        // Then convert it to RGB again
        // Returns a ColorMix.Color instance.
        return this.mix([C1, C2], [previous.percent, next.percent]);
    }
}

ColorMix.prototype.Color = Color;
ColorMix.prototype.ColorSpace = ColorSpace;

const instance = new ColorMix();
module.exports = instance;
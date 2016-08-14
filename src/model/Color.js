/**
 * Color
 *
 * An object representation of a color.
 */

import ColorSpace from './ColorSpace';
import DOMSelector from '../utils/DOMSelector';

export default class Color {

    constructor (red = 0, green = 0, blue = 0) {
        this.red = 0;
        this.green = 0;
        this.blue = 0;

        if (typeof red === 'string') {
            this.fromHex(red);
        } else {
            this.red = parseInt(red);
            this.green = parseInt(green);
            this.blue = parseInt(blue);
        }

        return this;
    }

    fromHex (hex = '') {

        if (hex.length > 0) {
            if (hex[0] == '#') {
                hex = hex.slice(1);
            }

            if (hex.length == 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }

            this.red = parseInt(hex.slice(0, 2), 16);
            this.green = parseInt(hex.slice(2, 4), 16);
            this.blue = parseInt(hex.slice(4, 6), 16);
        } else {
            this.red = 0;
            this.green = 0;
            this.blue = 0;
        }

        return this;
    }

    setRed (red = 0) {
        this.red = Math.min(255, Math.max(0, parseInt(red)));

        return this;
    }

    getRed () {
        return this.red;
    }

    setGreen (green = 0) {
        this.green = Math.min(255, Math.max(0, parseInt(green)));

        return this;
    }

    getGreen () {
        return this.green;
    }

    setBlue (blue = 0) {
        this.blue = Math.min(255, Math.max(0, parseInt(blue)));

        return this;
    }

    getBlue () {
        return this.blue;
    }

    toString (mode) {
        let color = '';
        let hslColor = null;

        switch (mode) {
            case 'rgb':
                color = 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
                break;
            case 'rgba':
                color = 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', 1)';
                break;
            case 'hsl':
                hslColor = ColorSpace.RGBtoHSL(this.red, this.green, this.blue);
                color = 'hsl(' + hslColor.hue + ', ' + hslColor.sat + '%, ' + hslColor.lig + '%)';
                break;
            case 'hsla':
                hslColor = ColorSpace.RGBtoHSL(this.red, this.green, this.blue);
                color = 'hsla(' + hslColor.hue + ', ' + hslColor.sat + '%, ' + hslColor.lig + '%, 1)';
                break;
            default:
                color = '#' + ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);
                break;
        }

        return color;
    }

    useAsBackground (selector) {
        if (selector && typeof selector == 'object') {
            if ('css' in selector && typeof selector.css == 'function') {
                selector.css('background-color', this.toString());
            }
        } else {
            let elements = DOMSelector.querySelectorAll(selector);

            elements.map((element) => {
                element.style['background-color'] = this.toString();
            });
        }

        return this;
    }

    useAsColor (selector) {
        if (selector && typeof selector == 'object') {
            if ('css' in selector && typeof selector.css == 'function') {
                selector.css('color', this.toString());
            }
        } else {
            let elements = DOMSelector.querySelectorAll(selector);

            elements.map((element) => {
                element.style['color'] = this.toString();
            });
        }

        return this;
    }

}
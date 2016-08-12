(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ColorMix = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ColorSpace = require('./ColorSpace');

var _ColorSpace2 = _interopRequireDefault(_ColorSpace);

var _DOMSelector = require('./DOMSelector');

var _DOMSelector2 = _interopRequireDefault(_DOMSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
    function Color() {
        var red = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var green = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var blue = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        _classCallCheck(this, Color);

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

    _createClass(Color, [{
        key: 'fromHex',
        value: function fromHex() {
            var hex = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


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
    }, {
        key: 'setRed',
        value: function setRed() {
            var red = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.red = Math.min(255, Math.max(0, parseInt(red)));

            return this;
        }
    }, {
        key: 'getRed',
        value: function getRed() {
            return this.red;
        }
    }, {
        key: 'setGreen',
        value: function setGreen() {
            var green = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.green = Math.min(255, Math.max(0, parseInt(green)));

            return this;
        }
    }, {
        key: 'getGreen',
        value: function getGreen() {
            return this.green;
        }
    }, {
        key: 'setBlue',
        value: function setBlue() {
            var blue = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.blue = Math.min(255, Math.max(0, parseInt(blue)));

            return this;
        }
    }, {
        key: 'getBlue',
        value: function getBlue() {
            return this.blue;
        }
    }, {
        key: 'toString',
        value: function toString(mode) {
            var color = '';
            var hslColor = null;

            switch (mode) {
                case 'rgb':
                    color = 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
                    break;
                case 'rgba':
                    color = 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', 1)';
                    break;
                case 'hsl':
                    hslColor = _ColorSpace2.default.RGBtoHSL(this.red, this.green, this.blue);
                    color = 'hsl(' + hslColor.hue + ', ' + hslColor.sat + '%, ' + hslColor.lig + '%)';
                    break;
                case 'hsla':
                    hslColor = _ColorSpace2.default.RGBtoHSL(this.red, this.green, this.blue);
                    color = 'hsla(' + hslColor.hue + ', ' + hslColor.sat + '%, ' + hslColor.lig + '%, 1)';
                    break;
                default:
                    color = '#' + ((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1);
                    break;
            }

            return color;
        }
    }, {
        key: 'useAsBackground',
        value: function useAsBackground(selector) {
            var _this = this;

            if (selector && (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') {
                if ('css' in selector && typeof selector.css == 'function') {
                    selector.css('background-color', this.toString());
                }
            } else {
                var elements = _DOMSelector2.default.querySelectorAll(selector);

                elements.map(function (element) {
                    element.style['background-color'] = _this.toString();
                });
            }

            return this;
        }
    }, {
        key: 'useAsColor',
        value: function useAsColor(selector) {
            var _this2 = this;

            if (selector && (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') {
                if ('css' in selector && typeof selector.css == 'function') {
                    selector.css('color', this.toString());
                }
            } else {
                var elements = _DOMSelector2.default.querySelectorAll(selector);

                elements.map(function (element) {
                    element.style['color'] = _this2.toString();
                });
            }

            return this;
        }
    }]);

    return Color;
}();

exports.default = Color;

},{"./ColorSpace":3,"./DOMSelector":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require('./Color');

var _Color2 = _interopRequireDefault(_Color);

var _ColorSpace = require('./ColorSpace');

var _ColorSpace2 = _interopRequireDefault(_ColorSpace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorMix = function () {
    function ColorMix() {
        _classCallCheck(this, ColorMix);

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

    _createClass(ColorMix, [{
        key: 'mix',
        value: function mix(colors, percents) {
            if (typeof colors == 'undefined' || Object.prototype.toString.call(colors) != '[object Array]') {
                throw new Error('"ColorMix.mix()" first parameter should be an array of ColorMix.Color objects');
            }

            if (typeof percents == 'undefined') {
                percents = [];
                var _i = colors.length;

                while (_i--) {
                    percents[_i] = 100 / colors.length;
                }
            } else if (Object.prototype.toString.call(percents) != '[object Array]') {
                throw new Error('"ColorMix.mix()" second parameter should be an array of percents. (nnumber values)');
            }

            if (colors.length != percents.length) {
                throw new Error('"ColorMix.mix()" parameters should be arrays of the same size !');
            }

            var i = colors.length;
            var L = 0;
            var a = 0;
            var b = 0;
            var P = 0;

            while (i--) {
                if (!(colors[i] instanceof _Color2.default)) {
                    throw new Error('"ColorMix.mix()" color at index: ' + i + ' should be an instance of ColorMix.Color() object !');
                }

                P += percents[i];

                if (P > 100) {
                    throw new Error('Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.');
                }

                var Lab = _ColorSpace2.default.RGBtoLab(colors[i].getRed(), colors[i].getGreen(), colors[i].getBlue());

                L += Lab.L * percents[i] / 100;
                a += Lab.a * percents[i] / 100;
                b += Lab.b * percents[i] / 100;
            }

            if (P != 100) {
                throw new Error('Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.');
            }

            var RGB = _ColorSpace2.default.LabtoRGB(L, a, b);

            return new _Color2.default(RGB.red, RGB.green, RGB.blue);
        }
    }, {
        key: 'setGradient',
        value: function setGradient(newGradient) {
            if (typeof newGradient != 'undefined' && Object.prototype.toString.call(newGradient) == '[object Array]') {
                this.gradient = newGradient;
            }

            return this;
        }
    }, {
        key: 'getGradient',
        value: function getGradient() {
            return this.gradient;
        }
    }, {
        key: 'blend',
        value: function blend(reference) {
            if (typeof reference == 'undefined') {
                throw new Error('Missing "ColorMix.blend()" first parameter.');
            }

            reference = parseInt(reference);

            if (isNaN(reference)) {
                throw new Error('Invalid "ColorMix.blend()" first parameter: you should provide a number.');
            }

            var l = this.gradient.length;
            var previous = this.gradient[0];
            var next = this.gradient[l - 1];

            // Get the color range (the closest steps of reference in the gradient)
            if (reference <= previous.reference) {
                return new _Color2.default(previous.color.red, previous.color.green, previous.color.blue);
            } else if (reference >= next.reference) {
                return new _Color2.default(next.color.red, next.color.green, next.color.blue);
            }

            while (l--) {
                var step = this.gradient[l];

                if (step.reference <= reference && step.reference > previous.reference) {
                    previous = step;
                } else if (step.reference >= reference && step.reference < next.reference) {
                    next = step;
                }
            }

            var C1 = new _Color2.default(previous.color.red, previous.color.green, previous.color.blue);
            var C2 = new _Color2.default(next.color.red, next.color.green, next.color.blue);

            // Calculate percentages
            previous.percent = Math.abs(100 / ((previous.reference - next.reference) / (reference - next.reference)));
            next.percent = 100 - previous.percent;

            // Mix the colors on LAB Color Space
            // Then convert it to RGB again
            // Returns a ColorMix.Color instance.
            return this.mix([C1, C2], [previous.percent, next.percent]);
        }
    }]);

    return ColorMix;
}();

ColorMix.prototype.Color = _Color2.default;
ColorMix.prototype.ColorSpace = _ColorSpace2.default;

var instance = new ColorMix();
module.exports = instance;

},{"./Color":1,"./ColorSpace":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Singleton tool for ColorSpace manipulation
var ColorSpace = function () {
    function ColorSpace() {
        _classCallCheck(this, ColorSpace);
    }

    _createClass(ColorSpace, [{
        key: 'RGB',
        value: function RGB(R, G, B) {
            if (typeof R == 'undefined' || typeof G == 'undefined' || typeof B == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGB()"');
            }

            return {
                'red': isNaN(parseInt(R)) ? 0 : parseInt(R),
                'green': isNaN(parseInt(G)) ? 0 : parseInt(G),
                'blue': isNaN(parseInt(B)) ? 0 : parseInt(B)
            };
        }
    }, {
        key: 'XYZ',
        value: function XYZ(X, Y, Z) {
            if (typeof X == 'undefined' || typeof Y == 'undefined' || typeof Z == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZ()"');
            }

            return {
                'x': isNaN(parseFloat(X)) ? 0.0 : parseFloat(X),
                'y': isNaN(parseFloat(Y)) ? 0.0 : parseFloat(Y),
                'z': isNaN(parseFloat(Z)) ? 0.0 : parseFloat(Z)
            };
        }
    }, {
        key: 'HSL',
        value: function HSL(H, S, L) {
            if (typeof H == 'undefined' || typeof S == 'undefined' || typeof L == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.HSL()"');
            }

            return {
                'hue': isNaN(parseInt(H)) ? 0.0 : parseInt(H),
                'sat': isNaN(parseInt(S)) ? 0.0 : parseInt(S),
                'lig': isNaN(parseInt(L)) ? 0.0 : parseInt(L)
            };
        }
    }, {
        key: 'Lab',
        value: function Lab(L, a, b) {
            if (typeof L == 'undefined' || typeof a == 'undefined' || typeof b == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.Lab()"');
            }

            return {
                'L': isNaN(parseFloat(L)) ? 0.0 : parseFloat(L),
                'a': isNaN(parseFloat(a)) ? 0.0 : parseFloat(a),
                'b': isNaN(parseFloat(b)) ? 0.0 : parseFloat(b)
            };
        }
    }, {
        key: 'RGBtoXYZ',
        value: function RGBtoXYZ(R, G, B) {
            var RGB = void 0;

            if (typeof R != 'undefined' && typeof G != 'undefined' && typeof B != 'undefined') {
                RGB = this.RGB(R, G, B);
            } else if (typeof R != 'undefined' && (typeof R === 'undefined' ? 'undefined' : _typeof(R)) == 'object' && typeof R.red != 'undefined' && typeof R.green != 'undefined' && typeof R.blue != 'undefined') {
                RGB = this.RGB(R.red, R.green, R.blue);
            } else {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".');
            }

            var red = parseFloat(RGB.red / 255); // R [0::255] as %
            var green = parseFloat(RGB.green / 255); // G [0::255] as %
            var blue = parseFloat(RGB.blue / 255); // B [0::255] as %

            red = 100 * (red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red /= 12.92);
            green = 100 * (green > 0.04045 ? Math.pow((green + 0.055) / 1.055, 2.4) : green /= 12.92);
            blue = 100 * (blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue /= 12.92);

            return this.XYZ(red * 0.4124 + green * 0.3576 + blue * 0.1805, red * 0.2126 + green * 0.7152 + blue * 0.0722, red * 0.0193 + green * 0.1192 + blue * 0.9505);
        }
    }, {
        key: 'XYZtoRGB',
        value: function XYZtoRGB(X, Y, Z) {
            var XYZ = void 0;

            if (typeof X != 'undefined' && typeof Y != 'undefined' && typeof Z != 'undefined') {
                XYZ = this.XYZ(X, Y, Z);
            } else if (X != 'undefined' && (typeof X === 'undefined' ? 'undefined' : _typeof(X)) == 'object' && typeof X.x != 'undefined' && typeof X.y != 'undefined' && typeof X.z != 'undefined') {
                XYZ = this.XYZ(X.x, X.y, X.z);
            } else {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoRGB()".');
            }

            var x = XYZ.x / 100; // x [0::95.047]
            var y = XYZ.y / 100; // y [0::100.000]
            var z = XYZ.z / 100; // z [0::108.883]

            var red = x * 3.2406 + y * -1.5372 + z * -0.4986;
            var green = x * -0.9689 + y * 1.8758 + z * 0.0415;
            var blue = x * 0.0557 + y * -0.2040 + z * 1.0570;

            red = 255 * (red > 0.0031308 ? 1.055 * Math.pow(red, 1 / 2.4) - 0.055 : red *= 12.92);
            green = 255 * (green > 0.0031308 ? 1.055 * Math.pow(green, 1 / 2.4) - 0.055 : green *= 12.92);
            blue = 255 * (blue > 0.0031308 ? 1.055 * Math.pow(blue, 1 / 2.4) - 0.055 : blue *= 12.92);

            return this.RGB(Math.round(red), Math.round(green), Math.round(blue));
        }
    }, {
        key: 'RGBtoHSL',
        value: function RGBtoHSL(R, G, B) {
            var RGB = void 0;

            if (typeof R != 'undefined' && typeof G != 'undefined' && typeof B != 'undefined') {
                RGB = this.RGB(R, G, B);
            } else if (R != 'undefined' && (typeof R === 'undefined' ? 'undefined' : _typeof(R)) == 'object' && typeof R.red != 'undefined' && typeof R.green != 'undefined' && typeof R.blue != 'undefined') {
                RGB = this.RGB(R.red, R.green, R.blue);
            } else {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".');
            }

            var red = RGB.red / 255;
            var green = RGB.green / 255;
            var blue = RGB.blue / 255;

            var max = Math.max(red, green, blue);
            var min = Math.min(red, green, blue);
            var H = 0;
            var S = 0;
            var L = (max + min) / 2;

            // non-achromatic
            if (max != min) {
                var d = max - min;

                if (L > 0.5) {
                    S = d / (2 - max - min);
                } else {
                    S = d / (max + min);
                }

                switch (max) {
                    case 'red':
                        H = (green - blue) / d + (green < blue ? 6 : 0);
                        break;
                    case 'green':
                        H = (blue - red) / d + 2;
                        break;
                    case 'blue':
                        H = (red - green) / d + 4;
                        break;
                }

                H /= 6;
            }

            return this.HSL(Math.floor(H * 360), Math.floor(S * 100), Math.floor(L * 100));
        }
    }, {
        key: 'XYZtoLab',
        value: function XYZtoLab(X, Y, Z) {
            var XYZ = void 0;

            if (typeof X != 'undefined' && typeof Y != 'undefined' && typeof Z != 'undefined') {
                XYZ = this.XYZ(X, Y, Z);
            } else if (typeof X != 'undefined' && (typeof X === 'undefined' ? 'undefined' : _typeof(X)) == 'object' && typeof X.x != 'undefined' && typeof X.y != 'undefined' && typeof X.z != 'undefined') {
                XYZ = this.XYZ(X.x, X.y, X.z);
            } else {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoLab()".');
            }

            var x = XYZ.x / 95.047;
            var y = XYZ.y / 100.000;
            var z = XYZ.z / 108.883;

            x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
            y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
            z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

            return this.Lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
        }
    }, {
        key: 'LabtoXYZ',
        value: function LabtoXYZ(L, a, b) {
            var Lab = void 0;

            if (typeof L != 'undefined' && typeof a != 'undefined' && typeof b != 'undefined') {
                Lab = this.Lab(L, a, b);
            } else if (typeof L != 'undefined' && (typeof L === 'undefined' ? 'undefined' : _typeof(L)) == 'object' && typeof L.L != 'undefined' && typeof L.a != 'undefined' && typeof L.b != 'undefined') {
                Lab = this.Lab(L.L, L.a, L.b);
            } else {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoXYZ()".');
            }

            var Y = (Lab.L + 16) / 116;
            var X = Lab.a / 500 + Y;
            var Z = Y - Lab.b / 200;

            Y = Math.pow(Y, 3) > 0.008856 ? Math.pow(Y, 3) : (Y - 16 / 116) / 7.787;
            X = Math.pow(X, 3) > 0.008856 ? Math.pow(X, 3) : (X - 16 / 116) / 7.787;
            Z = Math.pow(Z, 3) > 0.008856 ? Math.pow(Z, 3) : (Z - 16 / 116) / 7.787;

            return this.XYZ(X * 95.047, Y * 100.000, Z * 108.883);
        }
    }, {
        key: 'RGBtoLab',
        value: function RGBtoLab(R, G, B) {
            if (typeof R == 'undefined' || typeof G == 'undefined' || typeof B == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoLab()"');
            }

            return this.XYZtoLab(this.RGBtoXYZ(R, G, B));
        }
    }, {
        key: 'LabtoRGB',
        value: function LabtoRGB(L, a, b) {
            if (typeof L == 'undefined' || typeof a == 'undefined' || typeof b == 'undefined') {
                throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoRGB()"');
            }

            return this.XYZtoRGB(this.LabtoXYZ(L, a, b));
        }
    }]);

    return ColorSpace;
}();

var instance = new ColorSpace();
exports.default = instance;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMSelector = function () {
    function DOMSelector() {
        _classCallCheck(this, DOMSelector);
    }

    _createClass(DOMSelector, [{
        key: 'querySelectorAll',
        value: function querySelectorAll(selector) {
            selector = new String(selector);

            var elements = [];

            if (selector.length > 0) {
                if ('querySelectorAll' in document) {
                    var DOMelements = document.querySelectorAll(selector);

                    DOMelements.forEach(function (DOMelement) {
                        elements.push(DOMelement);
                    });
                } else {
                    switch (selector[0]) {
                        case '#':
                            elements.push(document.getElementById(selector.slice(1)));
                            break;
                        case '.':
                            if (document.getElementsByClassName) {
                                var _DOMelements2 = document.getElementsByClassName(selector);

                                _DOMelements2.forEach(function (DOMelement) {
                                    elements.push(DOMelement);
                                });
                            } else {
                                var _DOMelements3 = document.getElementsByTagName('*');
                                var i = _DOMelements3.length;

                                while (i--) {
                                    if (_DOMelements3[i].className === selector.slice(1)) {
                                        elements.push(_DOMelements3[i]);
                                    }
                                }
                            }
                            break;
                        default:
                            var _DOMelements = document.getElementsByTagName(selector);

                            _DOMelements.forEach(function (DOMelement) {
                                elements.push(DOMelement);
                            });
                            break;
                    }
                }
            }

            return elements;
        }
    }]);

    return DOMSelector;
}();

var instance = new DOMSelector();
exports.default = instance;

},{}]},{},[2])(2)
});
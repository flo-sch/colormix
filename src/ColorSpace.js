// Singleton tool for ColorSpace manipulation
class ColorSpace {

    RGB (R, G, B) {
        if (typeof R == 'undefined' || typeof G == 'undefined' || typeof B == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGB()"');
        }

        return {
            'red': isNaN(parseInt(R)) ? 0 : parseInt(R),
            'green': isNaN(parseInt(G)) ? 0 : parseInt(G),
            'blue': isNaN(parseInt(B)) ? 0 : parseInt(B)
        }
    }

    XYZ (X, Y, Z) {
        if (typeof X == 'undefined' || typeof Y == 'undefined' || typeof Z == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZ()"');
        }

        return {
            'x': isNaN(parseFloat(X)) ? 0.0 : parseFloat(X),
            'y': isNaN(parseFloat(Y)) ? 0.0 : parseFloat(Y),
            'z': isNaN(parseFloat(Z)) ? 0.0 : parseFloat(Z)
        }
    }

    HSL (H, S, L) {
        if (typeof H == 'undefined' || typeof S == 'undefined' || typeof L == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.HSL()"');
        }

        return {
            'hue': isNaN(parseInt(H)) ? 0.0 : parseInt(H),
            'sat': isNaN(parseInt(S)) ? 0.0 : parseInt(S),
            'lig': isNaN(parseInt(L)) ? 0.0 : parseInt(L)
        }
    }

    Lab (L, a, b) {
        if (typeof L == 'undefined' || typeof a == 'undefined' || typeof b == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.Lab()"');
        }

        return {
            'L': isNaN(parseFloat(L)) ? 0.0 : parseFloat(L),
            'a': isNaN(parseFloat(a)) ? 0.0 : parseFloat(a),
            'b': isNaN(parseFloat(b)) ? 0.0 : parseFloat(b)
        }
    }

    RGBtoXYZ (R, G, B) {
        let RGB;

        if (typeof R != 'undefined' && typeof G != 'undefined' && typeof B != 'undefined') {
            RGB = this.RGB(R, G, B);
        } else if (typeof R != 'undefined' && typeof R == 'object' && typeof R.red != 'undefined' && typeof R.green != 'undefined' && typeof R.blue != 'undefined') {
            RGB = this.RGB(R.red, R.green, R.blue);
        } else {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".');
        }

        let red = parseFloat(RGB.red / 255); // R [0::255] as %
        let green = parseFloat(RGB.green / 255); // G [0::255] as %
        let blue = parseFloat(RGB.blue / 255); // B [0::255] as %

        red = 100 * (red > 0.04045 ? Math.pow((( red + 0.055) / 1.055), 2.4) : red /= 12.92);
        green = 100 * (green > 0.04045 ? Math.pow(((green + 0.055) / 1.055), 2.4) : green /= 12.92);
        blue = 100 * (blue > 0.04045 ? Math.pow(((blue + 0.055) / 1.055), 2.4) : blue /= 12.92);

        return this.XYZ(red * 0.4124 + green * 0.3576 + blue * 0.1805, red * 0.2126 + green * 0.7152 + blue * 0.0722, red * 0.0193 + green * 0.1192 + blue * 0.9505);
    }

    XYZtoRGB (X, Y, Z) {
        let XYZ;

        if (typeof X != 'undefined' && typeof Y != 'undefined' && typeof Z != 'undefined') {
            XYZ = this.XYZ(X, Y, Z);
        } else if (X != 'undefined' && typeof X == 'object' && typeof X.x != 'undefined' && typeof X.y != 'undefined' && typeof X.z != 'undefined') {
            XYZ = this.XYZ(X.x, X.y, X.z);
        } else {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoRGB()".');
        }

        let x = XYZ.x / 100 // x [0::95.047]
        let y = XYZ.y / 100 // y [0::100.000]
        let z = XYZ.z / 100 // z [0::108.883]

        let red = x * 3.2406 + y * -1.5372 + z * -0.4986
        let green = x * -0.9689 + y * 1.8758 + z * 0.0415
        let blue = x * 0.0557 + y * -0.2040 + z * 1.0570

        red = 255 * (red > 0.0031308 ? 1.055 * (Math.pow(red, (1 / 2.4))) - 0.055 : red *= 12.92)
        green = 255 * (green > 0.0031308 ? 1.055 * (Math.pow(green, (1 / 2.4))) - 0.055 : green *= 12.92)
        blue = 255 * (blue > 0.0031308 ? 1.055 * (Math.pow(blue, (1 / 2.4))) - 0.055 : blue *= 12.92)

        return this.RGB(Math.round(red), Math.round(green), Math.round(blue));
    }

    RGBtoHSL (R, G, B) {
        let RGB;

        if (typeof R != 'undefined' && typeof G != 'undefined' && typeof B != 'undefined') {
            RGB = this.RGB(R, G, B);
        } else if (R != 'undefined' && typeof R == 'object' && typeof R.red != 'undefined' && typeof R.green != 'undefined' && typeof R.blue != 'undefined') {
            RGB = this.RGB(R.red, R.green, R.blue);
        } else {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".');
        }

        let red = RGB.red / 255;
        let green = RGB.green / 255;
        let blue = RGB.blue / 255;

        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let H = 0;
        let S = 0;
        let L = (max + min) / 2;

        // non-achromatic
        if (max != min) {
            let d = max - min;

            if (L > 0.5) {
                S = d / (2 - max - min);
            } else {
                S = d / (max + min);
            }

            switch (max) {
                case 'red':
                    H = (green - blue) / d + (green < blue ? 6 : 0);
                    break
                case 'green':
                    H = (blue - red) / d + 2;
                    break
                case 'blue':
                    H = (red - green) / d + 4;
                    break
            }

            H /= 6;
        }

        return this.HSL(Math.floor(H * 360), Math.floor(S * 100), Math.floor(L * 100));
    }

    XYZtoLab (X, Y, Z) {
        let XYZ;

        if (typeof X != 'undefined' && typeof Y != 'undefined' && typeof Z != 'undefined') {
            XYZ = this.XYZ(X, Y, Z);
        } else if (typeof X != 'undefined' && typeof X == 'object' && typeof X.x != 'undefined' && typeof X.y != 'undefined' && typeof X.z != 'undefined') {
            XYZ = this.XYZ(X.x, X.y, X.z);
        } else {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoLab()".');
        }

        let x = XYZ.x / 95.047;
        let y = XYZ.y / 100.000;
        let z = XYZ.z / 108.883;

        x = x > 0.008856 ? Math.pow(x,  (1 / 3)) : (7.787 * x) + 16 / 116;
        y = y > 0.008856 ? Math.pow(y,  (1 / 3)) : (7.787 * y) + 16 / 116;
        z = z > 0.008856 ? Math.pow(z,  (1 / 3)) : (7.787 * z) + 16 / 116;

        return this.Lab((116 * y) - 16, 500 * (x - y), 200 * (y - z));
    }

    LabtoXYZ (L, a, b) {
        let Lab;

        if (typeof L != 'undefined' && typeof a != 'undefined' && typeof b != 'undefined') {
            Lab = this.Lab(L, a, b);
        } else if (typeof L != 'undefined' && typeof L == 'object' && typeof L.L != 'undefined' && typeof L.a != 'undefined' && typeof L.b != 'undefined') {
            Lab = this.Lab(L.L, L.a, L.b);
        } else {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoXYZ()".');
        }

        let Y = (Lab.L + 16) / 116;
        let X = Lab.a / 500 + Y;
        let Z = Y - Lab.b / 200;

        Y = Math.pow(Y, 3) > 0.008856 ? Math.pow(Y, 3) : (Y - 16 / 116) / 7.787;
        X = Math.pow(X, 3) > 0.008856 ? Math.pow(X, 3) : (X - 16 / 116) / 7.787;
        Z = Math.pow(Z, 3) > 0.008856 ? Math.pow(Z, 3) : (Z - 16 / 116) / 7.787;

        return this.XYZ(X * 95.047, Y * 100.000, Z * 108.883);
    }

    RGBtoLab (R, G, B) {
        if (typeof R == 'undefined' || typeof G == 'undefined' || typeof B == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoLab()"');
        }

        return this.XYZtoLab(this.RGBtoXYZ(R, G, B));
    }

    LabtoRGB (L, a, b) {
        if (typeof L == 'undefined' || typeof a == 'undefined' || typeof b == 'undefined') {
            throw new Error('Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoRGB()"');
        }

        return this.XYZtoRGB(this.LabtoXYZ(L, a, b));
    }
}

const instance = new ColorSpace();
export default instance;

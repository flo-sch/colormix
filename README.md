# ColorMix.js

ColorMix.js makes it easy to manipulate Color objects in RGB, HSL, XYZ and Lab color spaces.
It allows you to mix, blend and render these colors with a gradient some colors.

Authored and currently maintained by [Flo-Schield-Bobby](http://floschild.me/).

Please refer to the [website](http://color-mix.it/) to get started or watch the complete documentation!

##### Contributions are welcome !

-----

## Usage

Create a Color object

```js
var color = new ColorMix.Color(255, 255, 255);
// Or if you prefer hexadecimal strings, it looks like this:
var color = new ColorMix.Color('#ffffff');
```

Manipulate a Color object

```js
var red = color.getRed();
// Chaining operations is possible
color.setRed(200).setBlue(300).setGreen(0);
// Then get the color value (of course "toString()" or other getters will break the chaining...)
color.toString('hex'); // "#c800ff" --> Hexadecimal by default
color.toString('rgb'); // "rgb(200, 0, 300)"
color.toString('hsl'); // "hsl(287, 100%, 50%)"
// And if you want rgba or hsla formats, even if the alpha is static
color.toString('rgba'); // "rgba(200, 0, 300, 1)"
color.toString('hsla'); // "hsla(287, 100%, 50%, 1)"
// Reset from an hexadecimal string
color.fromHex('#dd9911');
```

Render your colors on DOM HTML elements

```js
// Note that jQuery is used with the selector parameter if possible.
// A fallback is provided otherwise, but may not works for "complex" selectors as tag#id
color.useAsBackground('body');
color.useAsColor('#id');
```

Switch of color space

```js
// Note that this ColorSpace singleton is used in mix and blend functions.
// You probably will not need to use it directly.
var RGB = ColorMix.ColorSpace.RGB(255, 255, 255), // { red: 255, green: 255, blue: 255 }
	XYZ = ColorMix.ColorSpace.RGBtoXYZ(RGB), // { x: 95.05, y: 100, z: 108.89999999999999 }
	Lab = ColorMix.ColorSpace.XYZtoLab(XYZ); // { L: 100, a: 0.00526049995830391, b: -0.010408184525267927 }
```

Mix several colors with a percent ratio

```js
// Note that mix accept two argument: an array of ColorMix.Color instances and an array of ratio (the percent for each color)
// The sum of all this second argument should always be equal to 100.
var white = new ColorMix.Color(255, 255, 255),
	bootstrapLinkColor = new ColorMix.Color(0, 152, 204),
	bootstrapLinkColorLight = ColorMix.mix([white, bootstrapLinkColor], [30, 70]); // A lighted, "creamy" version of bootstapLinkColor !

// For instance, the following things will throw an exception
var M1 = ColorMix.mix([white, bootstrapLinkColor], [20]);
var M2 = ColorMix.mix([white, bootstrapLinkColor], [50, 80]);
var M3 = ColorMix.mix([white, bootstrapLinkColor], ['somestring', 80]);

// However, you can ignore this second array. In this case, the mix will returns the average of your colors in the L*a*b color space.
var M4 = ColorMix.mix([white, bootstrapLinkColor]); // Equivalent to ColorMix.mix([white, bootstrapLinkColor], [50, 50]);
```

Blend a reference in your gradient

```js
// You definitely should set up your own gradient before using the blend feature!
ColorMix.setGradient([
	{ reference: -10, color: { red: 0, green: 120, blue: 240 } },
	{ reference: 0, color: { red: 60, green: 90, blue: 180 } },
	{ reference: 10, color: { red: 120, green: 60, blue: 120 } }
]);

ColorMix.blend(7.34); // ColorMix.Color { red: 109, green: 70, blue: 138 }
// Then, as you get a ColorMix.Color instance, feel free to render it on a DOM element, for instance!
```

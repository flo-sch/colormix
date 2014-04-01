###
# ColorMix JavaScript Library v2.0.0
# http://color-mix.it
#
# Copyright 2013 @ Florent SCHILDKNECHT
#
# Date: 2014-03-29
###
ColorMix = do ->
    "use strict"
    _gradient = [{
        reference: 0
        color: {
            red: 0
            green: 0
            blue: 0
        }
    }, {
        reference: 100
        color: {
            red: 255
            green: 255
            blue: 255
        }
    }]
    Color = (R, G, B) ->
        @.setRed 0
        @.setGreen 0
        @.setBlue 0
        if R != undefined
            if G != undefined and B != undefined
                @.setRed parseInt(R)
                @.setGreen parseInt(G)
                @.setBlue parseInt(B)
            else if typeof R == 'string'
                @.fromHex R
        return @
    ColorSpace = do ->
        # Singleton tool for ColorSpace manipulation
        return {
            RGB: (R, G, B) ->
                if R == undefined or G == undefined or B == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGB()"'
                return {
                    'red': isNaN(parseInt(R)) ? 0 : parseInt(R)
                    'green': isNaN(parseInt(G)) ? 0 : parseInt(G)
                    'blue': isNaN(parseInt(B)) ? 0 : parseInt(B)
                }
            XYZ: (X, Y, Z) ->
                if X == undefined or Y == undefined or Z == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZ()"'
                return {
                    'x': isNaN(parseFloat(X)) ? 0.0 : parseFloat(X)
                    'y': isNaN(parseFloat(Y)) ? 0.0 : parseFloat(Y)
                    'z': isNaN(parseFloat(Z)) ? 0.0 : parseFloat(Z)
                }
            HSL: (H, S, L) ->
                if H == undefined or S == undefined or L == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.HSL()"'
                return {
                    'hue': isNaN(parseInt(H)) ? 0.0 : parseInt(H)
                    'sat': isNaN(parseInt(S)) ? 0.0 : parseInt(S)
                    'lig': isNaN(parseInt(L)) ? 0.0 : parseInt(L)
                }
            Lab: (L, a, b) ->
                if L == undefined or a == undefined or b == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.Lab()"'
                return {
                    'L': isNaN(parseFloat(L)) ? 0.0 : parseFloat(L)
                    'a': isNaN(parseFloat(a)) ? 0.0 : parseFloat(a)
                    'b': isNaN(parseFloat(b)) ? 0.0 : parseFloat(b)
                }
            RGBtoXYZ: (R, G, B) ->
                if R != undefined and G != undefined and B != undefined
                    RGB = new @.RGB R, G, B
                else if R != undefined and typeof R == 'object' and R.red != undefined and R.green != undefined and R.blue != undefined
                    RGB = new @.RGB(R.red, R.green, R.blue)
                else
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".'
                red = parseFloat RGB.red / 255 # R [0::255] as %
                green = parseFloat RGB.green / 255 # G [0::255] as %
                blue = parseFloat RGB.blue / 255 # B [0::255] as %

                if red > 0.04045
                    red = Math.pow (( red + 0.055) / 1.055), 2.4
                else
                    red /= 12.92
                red *= 100
                if green > 0.04045
                    green = Math.pow ((green + 0.055) / 1.055), 2.4
                else
                    green /= 12.92
                green *= 100
                if blue > 0.04045
                    blue = Math.pow ((blue + 0.055) / 1.055), 2.4
                else
                    blue /= 12.92
                blue *= 100

                return new @.XYZ red * 0.4124 + green * 0.3576 + blue * 0.1805, red * 0.2126 + green * 0.7152 + blue * 0.0722, red * 0.0193 + green * 0.1192 + blue * 0.9505
            XYZtoRGB: (X, Y, Z) ->
                if X != undefined and Y != undefined and Z != undefined
                    XYZ = new @.XYZ X, Y, Z
                else if X != undefined and typeof X == 'object' and X.x != undefined and X.y != undefined and X.z != undefined
                    XYZ = new @.XYZ X.x, X.y, X.z
                else
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoRGB()".'

                x = XYZ.x / 100 # x [0::95.047]
                y = XYZ.y / 100 # y [0::100.000]
                z = XYZ.z / 100 # z [0::108.883]
                red = x * 3.2406 + y * -1.5372 + z * -0.4986
                green = x * -0.9689 + y * 1.8758 + z * 0.0415
                blue = x * 0.0557 + y * -0.2040 + z * 1.0570

                if red > 0.0031308
                    red = 1.055 * (Math.pow(red, (1 / 2.4))) - 0.055
                else
                    red *= 12.92
                red *= 255
                if green > 0.0031308
                    green = 1.055 * (Math.pow(green, (1 / 2.4))) - 0.055
                else
                    green *= 12.92
                green *= 255
                if blue > 0.0031308
                    blue = 1.055 * (Math.pow(blue, (1 / 2.4))) - 0.055
                else
                    blue *= 12.92
                blue *= 255

                return new @.RGB Math.round(red), Math.round(green), Math.round(blue)
            RGBtoHSL: (R, G, B) ->
                if R != undefined and G != undefined and B != undefined
                    RGB = new @.RGB R, G, B
                else if R != undefined and typeof R == 'object' and R.red != undefined and R.green != undefined and R.blue != undefined
                    RGB = new @.RGB R.red, R.green, R.blue
                else
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoXYZ()".'

                red = RGB.red / 255
                green = RGB.green / 255
                blue = RGB.blue / 255

                max = Math.max red, green, blue
                min = Math.min red, green, blue
                L = (max + min) / 2

                if max == min
                    # achromatic
                    H = S = 0
                else
                    d = max - min
                    if L > 0.5
                        S = d / (2 - max - min)
                    else
                        S = d / (max + min)
                    switch max
                        when 'red'
                            H = (green - blue) / d + (green < blue ? 6 : 0)
                            break
                        when 'green'
                            H = (blue - red) / d + 2
                            break
                        when 'blue'
                            H = (red - green) / d + 4
                            break
                    H /= 6

                return new @.HSL Math.floor(H * 360), Math.floor(S * 100), Math.floor(L * 100)
            XYZtoLab: (X, Y, Z) ->
                if X != undefined and Y != undefined and Z != undefined
                    XYZ = new @.XYZ X, Y, Z
                else if X != undefined and typeof X == 'object' and X.x != undefined and X.y != undefined and X.z != undefined
                    XYZ = new @.XYZ X.x, X.y, X.z
                else
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.XYZtoLab()".'

                x = XYZ.x / 95.047
                y = XYZ.y / 100.000
                z = XYZ.z / 108.883

                if x > 0.008856
                    x = Math.pow(x,  (1 / 3))
                else
                    x = (7.787 * x) + 16 / 116
                if y > 0.008856
                    y = Math.pow(y,  (1 / 3))
                else
                    y = (7.787 * y) + 16 / 116
                if z > 0.008856
                    z = Math.pow(z,  (1 / 3))
                else
                    z = (7.787 * z) + 16 / 116

                return new @.Lab (116 * y) - 16, 500 * (x - y), 200 * (y - z)
            LabtoXYZ: (L, a, b) ->
                if L != undefined and a != undefined and b != undefined
                    Lab = new @.Lab L, a, b
                else if L != undefined and typeof L == 'object' and L.L != undefined and L.a != undefined and L.b != undefined
                    Lab = new @.Lab L.L, L.a, L.b
                else
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoXYZ()".'

                Y = (Lab.L + 16) / 116
                X = Lab.a / 500 + Y
                Z = Y - Lab.b / 200

                if Math.pow(Y, 3) > 0.008856
                    Y = Math.pow Y, 3
                else
                    Y = (Y - 16 / 116) / 7.787
                if Math.pow(X, 3) > 0.008856
                    X = Math.pow X, 3
                else
                    X = (X - 16 / 116) / 7.787
                if Math.pow(Z, 3) > 0.008856
                    Z = Math.pow Z, 3
                else
                    Z = (Z - 16 / 116) / 7.787

                return new @.XYZ(X * 95.047, Y * 100.000, Z * 108.883)
            RGBtoLab: (R, G, B) ->
                if R == undefined or G == undefined or B == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.RGBtoLab()"'
                return @.XYZtoLab @.RGBtoXYZ(R, G, B)
            LabtoRGB: (L, a, b) ->
                if L == undefined or a == undefined or b == undefined
                    throw 'Invalid parameter(s) provided for "ColorMix.ColorSpace.LabtoRGB()"'
                return @.XYZtoRGB @.LabtoXYZ(L, a, b)
        }

    Color.prototype = {
        fromHex: (hex) ->
            hex = String(hex or '')
            if hex.length > 0
                if hex[0] == '#'
                    hex = hex.slice 1
                if hex.length == 3
                    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
                red = parseInt hex.slice(0, 2), 16
                green = parseInt hex.slice(2, 4), 16
                blue = parseInt hex.slice(4, 6), 16

                @.setRed isNaN(red) ? 0 : red
                @.setGreen isNaN(green) ? 0 : green
                @.setBlue isNaN(blue) ? 0 : blue
            else
                @.setRed 0
                @.setGreen 0
                @.setBlue 0
            return @
        setRed: (R) ->
            if R != undefined
                @.red = Math.min 255, Math.max(0, parseInt(R))
            return @
        getRed: () ->
            return @.red
        setGreen: (G) ->
            if G != undefined
                @.green = Math.min 255, Math.max(0, parseInt(G))
            return @
        getGreen: () ->
            return @.green
        setBlue: (B) ->
            if B != undefined
                @.blue = Math.min 255, Math.max(0, parseInt(B))
            return @
        getBlue: () ->
            return @.blue
        toString: (mode) ->
            colorString = switch
                when mode =='rgb' then 'rgb(' + @.red + ', ' + @.green + ', ' + @.blue + ')'
                when mode == 'rgba'
                    colorString = 'rgba(' + @.red + ', ' + @.green + ', ' + @.blue + ', 1)'
                when mode == 'hsl'
                    HSL = ColorMix.ColorSpace.RGBtoHSL @.red, @.green, @.blue
                    colorString = 'hsl(' +  HSL.hue + ', ' + HSL.sat + '%, ' + HSL.lig + '%)'
                when mode == 'hsla'
                    HSL = ColorMix.ColorSpace.RGBtoHSL @.red, @.green, @.blue
                    colorString = 'hsla(' +  HSL.hue + ', ' + HSL.sat + '%, ' + HSL.lig + '%, 1)'
                else '#' + ((1 << 24) + (@.red << 16) + (@.green << 8) + @.blue).toString(16).slice(1)
            return colorString
        useAsBackground: (selector) ->
            selector = String selector
            if selector.length > 0
                if window.jQuery != undefined
                    window.jQuery(selector).css 'background-color', 'rgb(' + @.red + ', ' + @.green + ', ' + @.blue + ')'
                else
                    if typeof selector == 'string'
                        switch selector[0]
                            when '#'
                                elts = document.getElementById selector
                                break
                            when '.'
                                if document.getElementsByClassName
                                    elts = document.getElementsByClassName selector
                                else
                                    elts = []
                                    DOMelts = document.getElementsByTagName('*')
                                    i = DOMelts.length
                                    do elts.push(DOMelts[i]) while i-- when DOMelts[i].className == selector.slice(1)
                                break
                            else
                                elts = document.getElementsByTagName selector
                                break
                    i = elts.length
                    do elts[i].style['background-color'] = 'rgb(' + @.red + ', ' + @.green + ', ' + @.blue + ')' while i--
            return @
        useAsColor: (selector) ->
            selector = String selector
            if selector.length > 0
                if window.jQuery != undefined
                    window.jQuery(selector).css('color', 'rgb(' + @.red + ', ' + @.green + ', ' + @.blue + ')')
                else
                    if typeof selector == 'string'
                        switch selector[0]
                            when '#'
                                elts = document.getElementById selector
                                break
                            when '.'
                                if document.getElementsByClassName
                                    elts = document.getElementsByClassName selector
                                else
                                    elts = []
                                    DOMelts = document.getElementsByTagName '*'
                                    i = DOMelts.length
                                    do elts.push(DOMelts[i]) while i-- when DOMelts[i].className == selector.slice(1)
                                break
                            else
                                elts = document.getElementsByTagName selector
                    i = elts.length
                    do elts[i].style['color'] = 'rgb(' + @.red + ', ' + @.green + ', ' + @.blue + ')' while i--
            return @
    }

    return {
        'Color': Color,
        'ColorSpace': ColorSpace,
        'mix': (colors, percents) ->
            if colors == undefined or Object.prototype.toString.call(colors) != '[object Array]'
                throw '"ColorMix.mix()" first parameter should be an array of ColorMix.Color objects'
            if percents == undefined
                percents = []
                i = colors.length
                while i--
                    percents[i] = 100 / colors.length
            else if Object.prototype.toString.call(percents) != '[object Array]'
                throw '"ColorMix.mix()" second parameter should be an array of percents. (nnumber values)'
            if colors.length != percents.length
                throw '"ColorMix.mix()" parameters should be arrays of the same size !'
            i = colors.length
            L = 0
            a = 0
            b = 0
            P = 0
            while i--
                if !(colors[i] instanceof ColorMix.Color)
                    throw '"ColorMix.mix()" color at index: ' + i + ' should be an instance of ColorMix.Color() object !'
                P += percents[i]
                if P > 100
                    throw 'Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.'
                Lab = ColorMix.ColorSpace.RGBtoLab(colors[i].getRed(), colors[i].getGreen(), colors[i].getBlue())
                L += Lab.L * percents[i] / 100
                a += Lab.a * percents[i] / 100
                b += Lab.b * percents[i] / 100
            if P != 100
                throw 'Invalid "ColorMix.mix()" second parameter: the sum of all the percents array items should be 100.'
            RGB = ColorMix.ColorSpace.LabtoRGB L, a, b
            return new ColorMix.Color RGB.red, RGB.green, RGB.blue
        'setGradient': (newGradient) ->
            if newGradient != undefined and Object.prototype.toString.call(newGradient) == '[object Array]'
                _gradient = newGradient
            return @
        'getGradient': () ->
            return _gradient
        'blend': (reference) ->
            if reference == undefined
                throw 'Missing "ColorMix.blend()" first parameter.'
            reference = parseInt reference
            if isNaN reference
                throw 'Invalid "ColorMix.blend()" first parameter: you should provide a number.'

            l = _gradient.length
            previous = _gradient[0]
            next = _gradient[l - 1]

            # Get the color range (the closest steps of reference in the gradient)
            if reference <= previous.reference
                return new ColorMix.Color previous.color.red, previous.color.green, previous.color.blue
            else if reference >= next.reference
                return new ColorMix.Color next.color.red, next.color.green, next.color.blue

            while l--
                step = _gradient[l]
                if step.reference <= reference and step.reference > previous.reference
                    previous = step
                else if step.reference >= reference and step.reference < next.reference
                    next = step

            C1 = new ColorMix.Color previous.color.red, previous.color.green, previous.color.blue
            C2 = new ColorMix.Color next.color.red, next.color.green, next.color.blue

            # Calculate percentages
            previous.percent = Math.abs 100 / ((previous.reference - next.reference) / (reference - next.reference))
            next.percent = 100 - previous.percent

            # Mix the colors on LAB Color Space
            # Then convert it to RGB again
            # Returns a ColorMix.Color instance.
            return new ColorMix.mix [C1, C2], [previous.percent, next.percent]
    }

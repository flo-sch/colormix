/**
 * DOMSelector
 *
 * A polyfill singleton to select DOM elements
 */

/**
 * Convert nodes list to array
 *
 * NodesList to array conversion helper
 *
 * The NodesList API is slightly different of the Array.
 * It misses for instance the .map() method which is used by this ColorMix.
 */

let convertNodesListToArray = (list) => {
    let elements = [];

    list.forEach((element) => {
        elements.push(element);
    });

    return elements;
};

class DOMSelector {

    querySelectorAll (selector) {
        let elements = [];

        if (typeof document != 'undefined') {
            selector = new String(selector);

            if (selector.length > 0) {
                if ('querySelectorAll' in document) {
                    elements = convertNodesListToArray(document.querySelectorAll(selector));
                } else {
                    switch (selector[0]) {
                        case '#':
                            elements = [document.getElementById(selector.slice(1))];
                            break;
                        case '.':
                            if (document.getElementsByClassName) {
                                elements = convertNodesListToArray(document.getElementsByClassName(selector));
                            } else {
                                let DOMelements = document.getElementsByTagName('*');
                                let i = DOMelements.length;

                                while (i--) {
                                    if (DOMelements[i].className === selector.slice(1)) {
                                        elements.push(DOMelements[i]);
                                    }
                                }
                            }
                            break;
                        default:
                            elements = convertNodesListToArray(document.getElementsByTagName(selector));
                            break;
                    }
                }
            }
        }

        return elements;
    }

}

const instance = new DOMSelector();
export default instance;
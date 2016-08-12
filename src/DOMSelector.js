// Singleton helper for DOM-elements selection
class DOMSelector {

    querySelectorAll (selector) {
        selector = new String(selector);

        let elements = [];

        if (selector.length > 0) {
            if ('querySelectorAll' in document) {
                let DOMelements = document.querySelectorAll(selector);

                DOMelements.forEach((DOMelement) => {
                    elements.push(DOMelement);
                });
            } else {
                switch (selector[0]) {
                    case '#':
                        elements.push(document.getElementById(selector.slice(1)));
                        break;
                    case '.':
                        if (document.getElementsByClassName) {
                            let DOMelements = document.getElementsByClassName(selector);

                            DOMelements.forEach((DOMelement) => {
                                elements.push(DOMelement);
                            });
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
                        let DOMelements = document.getElementsByTagName(selector);

                        DOMelements.forEach((DOMelement) => {
                            elements.push(DOMelement);
                        });
                        break;
                }
            }
        }

        return elements;
    }

}

const instance = new DOMSelector();
export default instance;
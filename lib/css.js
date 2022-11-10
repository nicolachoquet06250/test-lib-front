import { savedComponents } from "./savedComponents.js";

function generateQuerySelector(el) {
    if (!el) return;
    if (el.tagName.toLowerCase() === "html") return el.tagName.toLowerCase();
    
    var str = el.tagName.toLowerCase();
    str += (el.id != "") ? "#" + el.id : "";
    
    if (el.className) {
        var classes = el.className.split(/\s/);
    
        for (var i = 0; i < classes.length; i++) {
            str += "." + classes[i]
        }
    }

    return generateQuerySelector(el.parentNode) + " > " + str;
}

/**
 * @param {HTMLElement} e 
 */
function getComponentSelectorFromElement(e) {
    const fullSelector = generateQuerySelector(e);

    const splitSelector = fullSelector.split(' > ');

    return splitSelector.reverse().reduce((r, c) => {
        const selectors = Array.from(savedComponents.entries()).map(([s]) => s); 
        const selector = selectors[selectors.indexOf(c)];
        
        if (r === null && selector) {
            return selector;
        }

        return r;
    }, null);
}

/**
 * @param {HTMLElement} e 
 */
 function getSelectorFromElement(e) {
    const fullSelector = generateQuerySelector(e);

    const splitSelector = fullSelector.split(' > ');

    let selector = getComponentSelectorFromElement(e);
    return splitSelector.reverse().reduce((r, c) => {
        if (selector && r.indexOf(selector) === -1) {
            return [...r, c];
        }

        return r;
    }, []).reverse().join(' > ');
}

export const styles = new Map();

/**
 * @param {string|CSSStyleDeclaration} rules 
 */
export const css = rules => 
    /**
     * @param {Array<HTMLElement|Array<HTMLElement>>} elements
     */
    (...elements) => {
        elements.map(e => {
            const component = getComponentSelectorFromElement(e);
            const selector = getSelectorFromElement(e);

            let _styles = !styles.has(selector) ? {...rules} : {...styles.get(selector), ...rules};
            
            if (!styles.has(component)) {
                styles.set(component, new Map());
            }

            styles.get(component).set(selector, _styles);
        });
    };

/**
 * @param {string|CSSStyleDeclaration} object 
 * @returns {string} objet transformé formaté en css
 */
export const objectToCss = (object) => {
    if (typeof object === 'string') {
        return object;
    }

    return '{\n' + Array.from(Object.keys(object))
        .map(k => {
            return '\t' + [...k.matchAll(/([A-Za-z][a-z0-9]+)/g)]
                .map(([m]) => m)
                .map(m => m.toLowerCase())
                .join('-') + ': ' + object[k] + ';';
        }).join('\n') + '\n}';
}
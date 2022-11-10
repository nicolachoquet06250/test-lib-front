/**
 * @param {string|CSSStyleDeclaration} rules 
 */
export const css = rules => 
    /**
     * @param {HTMLElement} e 
     */
    e => {
        if (typeof rules === 'object') {
            Object.keys(rules).map(k => {
                if (rules[k]) {
                    e.style[k] = rules[k];
                }
            });
        } else {
            e.setAttribute('style', rules);
        }
    };
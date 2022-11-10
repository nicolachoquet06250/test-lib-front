/**
 * @param {string|CSSStyleDeclaration} rules 
 */
export const css = rules => 
    /**
     * @param {Array<HTMLElement>} elements
     */
    (...elements) => {
        if (typeof rules === 'object') {

            elements.map(e => {
                Object.assign(e.style ?? {}, rules)
            })
        } else {
            elements.map(e => e.setAttribute('style', rules));
        }
    };
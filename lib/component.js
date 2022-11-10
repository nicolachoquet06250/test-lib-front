/**
 * @param {string} selector 
 * @param {number} childN 
 * @returns {(parent: HTMLElement) => HTMLElement|null} 
 */
export const getComponent = (selector, childN = 1) => 
    /**
     * @param {HTMLElement} parent 
     * @returns {HTMLElement|null}
     */
    parent => parent.querySelector(`${selector}:nth-of-type(${childN})`);
/**
 * @param {string} selector 
 * @param {number} childN 
 * @returns {(parent: HTMLElement) => ({ exists: () => boolean, remove: () => void, append: () => void, toggle: () => void })} 
 */
export const getComponent = (selector, childN = 1) => 
    parent => {
        const r = parent.querySelector(`${selector}:nth-of-type(${childN})`);
        
        return {
            id: null,

            exists() {
                return r !== null;
            },

            remove() {
                const tpl = document.createElement('template');
                tpl.appendChild(r.cloneNode(true));
                this.id = Math.floor(Math.random() * 100);
                tpl.setAttribute(
                    'data-element-id', 
                    `component-${r.tagName.toLowerCase()}-${this.id}`
                );

                r.after(tpl);
                r.remove();
            },

            append() {
                if (this.id) {
                    const tplEl = parent.querySelector(`[data-element-id=component-${r.tagName.toLowerCase()}-${this.id}]`);
                    const tpl = tplEl.cloneNode(true).content.firstElementChild;

                    tplEl.after(tpl);
                    tplEl.remove();
                }
            },

            toggle() {
                console.log(this.exists())
                if (this.exists()) {
                    this.remove();
                } else {
                    this.append();
                }
            }
        }
    };
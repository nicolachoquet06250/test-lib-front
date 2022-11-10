import { parseDom } from "./parseDom.js";
import { savedComponents } from "./savedComponents.js";
import { lifecicleFuncs } from "./lifecicle.js";

/**
 * @param {(params: Record<string, any>) => string} tpl
 * @returns {(params: Record<string, any>) => HTMLElement}
 */
export const html_ce = tpl => {
    const selector = [...tpl.name.matchAll(/([A-Z][a-z]+)/g)].map(m => m[0]).map(m => m.toLowerCase()).join('-');

    /**
     * @param {Function} func 
     * @returns {Array<{key: string, type: 'string'|'boolean'|'object'|'null'|'number'|'unknown'}>}
     */
    function getArgs(func) {
        
        /**
         * @param {string} objStr
         * @returns {Array<{key: string, type: 'string'|'boolean'|'object'|'null'|'number'|'unknown'}>}
         */
        function extractKeysOfObjectString(objStr) {
            const args = objStr.trim().substring(1, objStr.trim().length - 1).trim();

            return args.split(',').map(arg => {
                // Ensure no inline comments are parsed and trim the whitespace.
                return arg.replace(/\/\*.*\*\//, '').trim();
            }).filter(arg => {
                // Ensure no undefined values are added.
                return arg;
            }).map(arg => {
                const key = arg.split('=')[0].trim();
                let type = 'unknown';

                if (arg.split('=').length > 0) {
                    if (arg.split('=')[1].trim().indexOf('"') !== -1 || arg.split('=')[1].trim().indexOf("'") !== -1) {
                        type = 'string';
                    } else if (
                        (arg.split('=')[1].trim().indexOf('[') !== -1 && arg.split('=')[1].trim().indexOf(']') !== -1) || 
                        (arg.split('=')[1].trim().indexOf('{') !== -1 && arg.split('=')[1].trim().indexOf('}') !== -1)
                    ) {
                        type = 'object'
                    } else if (arg.split('=')[1].trim() === 'true' | arg.split('=')[1].trim() === 'false') {
                        type = 'boolean';
                    } else if (arg.split('=')[1].trim() === 'null') {
                        type = 'null';
                    } else if (arg.split('=')[1].trim().match(/^[0-9]+$/g)?.length > 0) {
                        type = 'number';
                    }
                }

                return { key, type };
            });
        }

        // First match everything inside the function argument parens.
        const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
        
        return extractKeysOfObjectString(
            args.split(',').map(function(arg) {
                // Ensure no inline comments are parsed and trim the whitespace.
                return arg.replace(/\/\*.*\*\//, '').trim();
            }).filter(function(arg) {
                // Ensure no undefined values are added.
                return arg;
            })
            .map(args => args.replaceAll(/\{\}/g, '[]'))
            .reduce((r, c) => {
                if (r.length > 0 && r[r.length - 1].indexOf('{') !== -1) {
                    if (r[r.length - 1].indexOf('}') === -1) {
                        r[r.length - 1] += ', ' + c;
        
                        return r;
                    }
                }
        
                return [...r, c];
            }, [])[0]
        )
    }

    if (!customElements.get(selector)) {
        const realProps = getArgs(tpl)

        class Component extends HTMLElement {
            constructor(props = {}) {
                super();

                Array.from(realProps.map(p => p.key))
                    .map(k => {
                        Object.defineProperty(this, k, {
                            get() {
                                return this.getAttribute(k) ?? null;
                            },
                            set(v) {
                                if (this[k] !== v) {
                                    this.setAttribute(k, v);
                                    this.#render();
                                }
                            }
                        });

                        if (props[k] !== undefined) {
                            this[k] = props[k];
                        }
                    });
            }

            static get observedAttributes() {
                return realProps.map(p => p.key);
            }

            static get selector() {
                return selector;
            }
            
            get props() {
                return realProps.map(p => p.key).reduce((r, c) => ({
                    ...r,
                    [c]: this[c]
                }), {});
            }

            connectedCallback() {
                this.#render();

                lifecicleFuncs.onUnmounted.set(selector, lifecicleFuncs
                    .onMounted.get(selector)
                        ?.map(hook => hook(this)));
            }

            #render() {
                const template = parseDom(tpl(this.props, Component.selector));
                this.innerHTML = '';
                this.appendChild(template);
            }

            disconnectedCallback() {
                const onUnmountedList = Array.from(lifecicleFuncs.onUnmounted.get(Component.selector).entries());
                
                onUnmountedList.map(([_, onRemoved]) => onRemoved(this));
            }
        }

        if (!(selector in savedComponents)) {
            savedComponents.set(Component.selector, Component);
        }

        customElements.define(selector, Component);
    }

    return customElements.get(selector);
};
import { parseDom } from "./parseDom.js";
import { savedComponents } from "./savedComponents.js";
import { lifecicleFuncs } from "./lifecicle.js";

/**
 * @param {string} selector
 * @param {(params: Record<string, any>) => string} tpl
 * @returns {(params: Record<string, any>) => HTMLElement}
 */
export const html = (selector, tpl) => {
    const component = (params = {}) => {
        const c = parseDom(tpl(params));
    
        lifecicleFuncs
            .onMounted
                .map(hook => hook(c));

        return c;
    };

    if (!(selector in savedComponents)) {
        savedComponents.set(selector, component);
    }

    return component;
}
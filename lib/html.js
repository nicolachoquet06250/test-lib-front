import { parseDom } from "./parseDom.js";
import { savedComponents } from "./savedComponents.js";

/**
 * @param {string} selector
 * @param {(params: Record<string, any>, lifecicle: Record<string, Function>) => string} tpl
 * @returns {(params: Record<string, any>, lifecicle: Record<string, Function>) => HTMLElement}
 */
export const html = (selector, tpl) => {
    const component = (
        params = {}, 
        lifecicle = {
            onMounted(cb = () => null) {
                cb()
            }
        }
    ) => parseDom(tpl(params, lifecicle));

    if (!(selector in savedComponents)) {
        savedComponents.set(selector, component);
    }

    return component;
}
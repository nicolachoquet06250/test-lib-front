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
        c.classList.add('c-' + selector)

        lifecicleFuncs.onUnmounted.set(selector, lifecicleFuncs
            .onMounted.get(selector)
                ?.map(hook => hook(c)));

        const observer = new MutationObserver(mutations_list => {
            mutations_list.forEach(mutation => {
                mutation.removedNodes.forEach(removedNode => {
                    const _selector = Array.from(savedComponents.entries())[Array.from(savedComponents.entries()).map(([k, _]) => removedNode.classList.contains('c-' + k)).indexOf(true)][0]
                    const onUnmountedList = Array.from(lifecicleFuncs.onUnmounted.get(_selector).entries());
                    
                    onUnmountedList.map(([_, onRemoved]) => onRemoved(removedNode));
                });
            });
        });

        observer.observe(
            c, {
                subtree: false, 
                childList: true
            }
        );

        return c;
    };

    if (!(selector in savedComponents)) {
        savedComponents.set(selector, component);
    }

    return component;
}
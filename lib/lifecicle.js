import { savedComponents } from "./savedComponents.js";

const lifecicleMethods = {
    onMounted: 'onMounted',
    onUnmounted: 'onUnmounted',
    //onBeforeUnmount: 'onBeforeUnmounted'
};

/**
 * @type {Record<keyof lifecicleMethods, Map<string, Array<((t: HTMLElement) => (s: string) => any)>>>}
 */
export const lifecicleFuncs = {
    onMounted: new Map(),
    onUnmounted: new Map(),
    //onBeforeUnmount: new Map(),
};

export const onMounted = (cb = () => null) => 
    /**
     * @param {string} s 
     */
    s => {
        if (!Array.from(lifecicleFuncs.onMounted.entries()).reduce((__, [_, c]) => {
            return Array.from(c).map(_c => _c.name === cb.name).indexOf(true) !== -1;
        }, false)) {
            lifecicleFuncs.onMounted
                .set(s, [...(lifecicleFuncs.onMounted.get(s) ?? []), cb]);
        }
    }

/*export const onBeforeUnmount = (cb = () => null) => 
    /**
     * @param {string} s
     *\/
    s => lifecicleFuncs.onBeforeUnmount.set(s, [...(lifecicleFuncs.onBeforeUnmount.get(s) ?? []), cb]);
*/
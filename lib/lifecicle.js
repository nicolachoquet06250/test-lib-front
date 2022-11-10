import { availableEvents } from './state.js';

const lifecicleMethods = {
    onMounted: 'onMounted',
    onUnmounted: 'onUnmounted',
};

/**
 * @type {Record<keyof lifecicleMethods, Map<string, Array<((t: HTMLElement) => (s: string) => any)>>>}
 */
export const lifecicleFuncs = {
    onMounted: new Map(),
    onUnmounted: new Map(),
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
    };

/**
 * @param {(old: unknown, new: unknown) => void} cb 
 * @param {Array<{ addEventListener: (event: keyof availableEvents, cb: ((old: unknown, newV: unknown) => void)) => void }>} deps 
 */
export const watch = (cb, ...deps) => {
    deps.map(dep => {
        dep.addEventListener('change', cb);
    })
};

/**
 * @param {string} event 
 * @param {(e: Event) => boolean|void} cb 
 * @param {Array<{ addEventListener: (event: string, cb: ((e: Event) => boolean|void)) => void }>} deps 
 */
export const on = (event, cb, ...deps) => {
    return {
        immediate() {
            deps.map(dep => dep.addEventListener(event, cb))
        },
        preventDefault() {
            deps.map(dep => {
                dep.addEventListener(event, e => {
                    e.preventDefault();
                    return cb(e)
                });
            })
        },
        stopPropagation() {
            deps.map(dep => {
                dep.addEventListener(event, e => {
                    e.stopPropagation();
                    return cb(e);
                });
            })
        },
        stopImmediatePropagation() {
            deps.map(dep => {
                dep.addEventListener(event, e => {
                    e.stopImmediatePropagation();
                    return scb(e);
                });
            })
        }
    }
};
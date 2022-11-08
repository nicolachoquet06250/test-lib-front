/**
 * @type {Record<string, Array<Function>>}
 */
export const lifecicleFuncs = {
    onMounted: []
};

export const onMounted = (cb = () => null) => {
    lifecicleFuncs.onMounted.push(cb);
};
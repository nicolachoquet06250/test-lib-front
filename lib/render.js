/**
 * @param {((params: Record<string, any>) => HTMLElement)|HTMLElement} component
 * @param {HTMLElement} app
 */
export const render = (component, app) => {
    if (app) {
        try {
            app.appendChild(component());
        } catch(e) {
            if (e.message !== 'component is not a function') {
                throw e;
            }

            app.appendChild(component);
        }
    } else {
        throw new Error('app is required');
    }
};
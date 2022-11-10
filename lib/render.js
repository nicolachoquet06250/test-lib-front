/**
 * @param {HTMLElement} component
 * @param {HTMLElement} app
 */
export const render_ce = (component, app) => {
    if (app) {
        app.appendChild(component);
    } else {
        throw new Error('app is required');
    }
};
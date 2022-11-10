import { html, onMounted } from "../../lib/index.js";

const selector = 'hello-world';

export default html(selector, ({ name = null }) => {
    onMounted(function handleHelloWorldMounted() {
        return component => console.log('hello-world removed', component);
    })(selector);

    return /*html*/ `
        <div>
            Hello ${name ?? 'there'}
        </div>
    `;
});
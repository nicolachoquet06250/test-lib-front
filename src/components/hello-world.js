import { html } from "../../lib/index.js";
import { onMounted } from "../../lib/lifecicle.js";

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
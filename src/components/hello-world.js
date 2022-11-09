import { html } from "../../lib/index.js";
import { onMounted } from "../../lib/lifecicle.js";

const selector = 'hello-world';

export default html(selector, ({ name = null }) => {
    onMounted(function handleHelloWorldMounted(t) {
        return r => console.log('hello-world removed', r);
    })(selector);

    return /*html*/ `
        <div>
            Coucou mon ${name ?? 'ami'}
        </div>
    `;
});
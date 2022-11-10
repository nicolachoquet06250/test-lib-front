import { html_ce, onMounted } from "../../lib/index.js";

export default html_ce(function HelloWorld({ name = null }, selector) {
    /*onMounted(function handleHelloWorldMounted() {
        return component => console.log('hello-world removed', component);
    })(selector);*/

    return /*html*/ `
        <div>
            Hello ${name ?? 'there'}
        </div>
    `;
});
import { html } from "../../lib/index.js";
import { onMounted } from "../../lib/lifecicle.js";
import helloWorld from "./hello-world.js";

export default html('app', ({ name = null }) => {
    onMounted((t) => {
        t.querySelector('a')?.addEventListener('click', e => {
            e.preventDefault();
            console.log(e.currentTarget.href)
        })
    });

    return /*html*/ `
        <div>
            <h1>Hello World</h1>

            <hello-world name="toi" />

            <br />

            <a  href="http://google.com" 
                target="_blank">
                link
            </a>

            <hello-world name="${name}" />
        </div>
    `;
});
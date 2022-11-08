import { html } from "../../lib/index.js";
import helloWorld from "./hello-world.js";

export default html('app', ({ name = null }, { onMonted = () => null } = {}) => {
    onMonted(() => {
        document.querySelector('a').addEventListener('click', e => {
            console.log(e.href)
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
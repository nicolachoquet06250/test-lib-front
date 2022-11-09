import { html } from "../../lib/index.js";
import { onMounted } from "../../lib/lifecicle.js";
import helloWorld from "./hello-world.js";

const selector = 'app';

export default html(selector, ({ name = null }) => {
    onMounted(function handleAppMounted(t) {
        t.querySelector('a').addEventListener('click', e => {
            e.preventDefault();

            if (!t.querySelector('div > span').textContent) {
                console.log(e.currentTarget.href)
                t.querySelector('div > span').textContent = e.currentTarget.href;
            }
        });
    
        return () => console.log('app removed', t);
    })(selector);

    return /*html*/ `
        <div>
            <h1>Hello World</h1>

            <hello-world name="toi" />

            <br />

            <a  href="http://google.com" 
                target="_blank">
                link
            </a>
            
            <div>
                <span></span>
            </div>

            <hello-world name="${name}" />
        </div>
    `;
});
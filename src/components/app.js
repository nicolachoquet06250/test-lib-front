import { css } from "../../lib/css.js";
import { html } from "../../lib/index.js";
import { on, onMounted, watch } from "../../lib/lifecicle.js";
import { state } from "../../lib/state.js";
import helloWorld from "./hello-world.js";

const selector = 'app';

export default html(selector, ({ name = null }) => {
    const [stateValue, setState, observer] = state(10);

    watch(oldVal => console.log('change', oldVal, stateValue()), [observer]);

    // watch will be triggered ( value has changed )
    setState(20);
    // watch will be triggered ( value has changed )
    setState(30);
    // watch will not be triggered ( value has not changed )
    setState(30);

    onMounted(function handleAppMounted(component) {
        const link = component.querySelector('a');
        const title = component.querySelector('h1');
    
        let colorUpdated = false;    
        on('click', e => {
            const span = component.querySelector('div > span');
            
            if (!span.textContent) {
                console.log(e.currentTarget.href)
                span.textContent = e.currentTarget.href;
            }
    
            if (!colorUpdated) {
                colorUpdated = true;
                css({ color: 'blue' })(title);
                
                setTimeout(() => {
                    css({ color: 'red' })(title);
                    colorUpdated = false;
                }, 2000);
            }
        }, [link]).preventDefault();

        css(`color: red;`)(link);
        css({ color: 'red' })(title);
    
        return () => console.log('app removed', component);
    })(selector);

    return /*html*/ `
        <div>
            <h1>Hello World</h1>

            <hello-world />

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
import { 
    html_ce, css, 
    state, 
    getComponent, 
    on, onMounted, watch
} from "../../lib/index.js";
import HelloWorld from "./hello-world.js";

export default html_ce(function MyApp({ name = null }, selector) {
    const [stateValue, setState, observer] = state(10);

    watch(oldVal => console.log('change', oldVal, stateValue()), observer);

    // watch will be triggered ( value has changed )
    setState(20);
    // watch will be triggered ( value has changed )
    setState(30);
    // watch will not be triggered ( value has not changed )
    setState(30);

    onMounted(function handleAppMounted(component) {
        const [link, title, button] = [
            component.querySelector('a'),
            component.querySelector('h1'),
            component.querySelector('button')
        ];

        css({ cursor: 'pointer' })(button);
    
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
        }, link).preventDefault();

        on('click', e => {
            getComponent('hello-world')(component)?.remove();
        }, button).preventDefault();

        css({ color: 'red' })(link, title);
    
        return () => console.log('app removed', component);
    })(selector);

    return /*html*/ `
        <div>
            <h1>Hello World</h1>

            <hello-world />

            <button type="button">
                Supprimer le premier composant "hello-world"
            </button>

            <hello-world name="toi" />

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
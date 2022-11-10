import { 
    html_ce, css, 
    state, 
    getComponent, 
    on, onMounted, watch, off
} from "../../lib/index.js";
import HelloWorld from "./hello-world.js";

export default html_ce(function MyApp({ name = null }, selector) {
    const [autofocus, setAutofocus, $autofocus] = state({ autofocus: false })(this);

    $autofocus.addEventListener('change', () => {
        console.log('autofocus change', autofocus());
    })

    /**
     * @param {HTMLElement} component 
     * @param {boolean} firstMount
     * @returns {() => never}
     */
    const handleAppMounted = (component, firstMount) => {
        const [link, title, button, input] = [
            component.querySelector('a'),
            component.querySelector('h1'),
            component.querySelector('button'),
            component.querySelector('input[type=text]')
        ];

        console.log('firstMount', firstMount)

        if (!firstMount) {
            input.focus();
            input.selectionStart = input.value.length;
        }
        setAutofocus(firstMount === false);
        
        css({ cursor: 'pointer'})(button);
    
        let colorUpdated = false;
        let listeners = [...on('click', e => {
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
        }, link).preventDefault()];

        listeners = [...listeners, ...on('click', () => {
            getComponent('hello-world')(component)?.remove();
        }, button).preventDefault()];

        listeners = [...listeners, ...on('input', e => {
            this.name = e.target.value;
        }, input).preventDefault()]

        css({ color: 'red', backgroundColor: 'blue' })(link, title);
    
        return () => {
            console.log('app removed', component);

            off(listeners);
        };
    };

    onMounted(handleAppMounted)(selector);

    console.log(autofocus());

    return /*html*/ `
        <div>
            <h1>Hello World</h1>

            <hello-world></hello-world>

            <button type="button">
                Supprimer le premier composant "hello-world"
            </button>

            <input type="text" value="${name}" ${autofocus() ? `autofocus="autofocus"` : ''} />

            <hello-world name="toi"></hello-world>

            <div>
                <a  href="http://google.com" 
                    target="_blank">
                    link
                </a>
            </div>
        
            <div>
                <span></span>
            </div>

            <hello-world name="${name}"></hello-world>
        </div>
    `;
});
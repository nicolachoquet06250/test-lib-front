import { render } from '../lib/index.js';
import App from './components/app.js';

render(
    App({ name: 'Nico' }), 
    document.querySelector('#app')
);
import { render_ce } from '../lib/index.js';
import App from './components/app.js';

render_ce(
    new App({ name: 'Nico' }), 
    document.querySelector('#app')
);
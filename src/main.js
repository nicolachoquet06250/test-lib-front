import { render, savedComponents } from '../lib/index.js';
import App from './components/app.js';

render(
    App({ name: 'Nico' }), 
    document.querySelector('#app')
);

//console.log(savedComponents)
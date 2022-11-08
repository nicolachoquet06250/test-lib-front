import { html } from "../../lib/index.js";

export default html('hello-world', ({ name = null }) => /*html*/ `
    <div>
        Coucou mon ${name ?? 'ami'}
    </div>
`);
import { savedComponents } from "./savedComponents.js";

/**
 * @param {HTMLElement} root
 * @param {Node} child
 * @param {(params: Record<string, any>) => HTMLElement} c
 */
const injectComponentInDOM = (root, child, c) => {
    const { attributes } = child;

    root.appendChild(
        c(
            Array.from(attributes)
                .reduce(
                    (r, e) => ({
                        ...r, 
                        [e.nodeName]: e.value
                    }), {}
                )
        )
    );
};

/**
 * @param {string} tpl
 * @return {HTMLElement|(params: Record<string, any>) => HTMLElement} 
 */
 export const parseDom = tpl => {
    const parser = new DOMParser();

    const dom = parser.parseFromString(tpl, 'application/xhtml+xml')
        .firstElementChild;

    const root = document.createElement(dom.tagName);
    
    for (const child of dom.childNodes) {
        const { tagName, attributes, childNodes, nodeType } = child;

        if (nodeType === Node.TEXT_NODE) {
            const text = document.createTextNode(child.textContent);
            root.append(text);
        } else {
            const element = document.createElement(tagName);

            if (child.hasChildNodes()) {
                element.append(...childNodes);
            }

            if (attributes && child.hasAttributes()) {
                Array.from(attributes)
                    .map(a => element.setAttribute(a.name, a.value));
            }

            root.appendChild(element);
        }
    }

    return root
};
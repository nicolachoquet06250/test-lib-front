/**
 * @type {Map<HTMLElement, Array<Observer>>}
 */
export const stateArray = new Map();

export const availableEvents = {
    change: 'change'
};

export class State {
    /**
     * @param {string} name
     * @param {unknown} v 
     */
    constructor(name, v) {
        this.#value = v;
        this.name = name;
    }

    /**
     * @type {Map<string, Array<(() => null)>>}
     */
    #events = new Map()
    /**
     * @type {unknown}
     */
    #value
    name

    get value() {
        return this.#value ?? null;
    }
    set value(v) {
        const oldValue = this.#value;

        if (
            typeof this.#value === 'object' && 
            typeof v === 'object' && 
            JSON.stringify(v) !== JSON.stringify(this.#value)
        ) {
            this.#value = v;

            this.#executeChangeValueEvent(oldValue, v);
            
            return;
        }

        if (v !== this.#value) {
            this.#value = v;
        
            this.#executeChangeValueEvent(oldValue, v);
        }
    }

    #executeChangeValueEvent(oldValue, newValue) {
        const changeEvents = this.#events.get('change');
        if (changeEvents) {
            Array.from(this.#events.get('change'))?.map(eventCb => {
                return eventCb;
            }).map(eventCb => eventCb(oldValue, newValue));
        }
    }

    /**
     * @param {keyof availableEvents} event 
     * @param {() => null} cb 
     */
    addEventListener(event, cb) {
        const currentEventArray = this.#events.get(event) ?? [];
        this.#events.set(event, [...currentEventArray, cb]);
    }
}

/**
 * @param {Record<string, unknown>} opts 
 * @returns {(e: HTMLElement) => [() => unknown, (v: unknown) => void, Observer]}
 */
export const state = opts => e => {
        const name = Object.keys(opts)[0];
        const s = new State(name, opts[name]);

        class Observer {
            get value() {
                return s.value;
            }
            set value(v) {
                s.value = v;
            }

            get name() {
                return name;
            }

            /**
             * @param {keyof availableEvents} event 
             * @param {((old: unknown, newV: unknown) => null)} cb 
             */
            addEventListener(event, cb) {
                s.addEventListener(event, cb)
            }
        }

        if (!stateArray.get(e)) stateArray.set(e, []);

        if (stateArray.has(e) && stateArray.get(e).filter(o => o.name === name).length > 0) {
            return [
                () => stateArray.get(e).filter(o => o.name === name)[0].value, 
                v => (stateArray.get(e).filter(o => o.name === name)[0].value = v), 
                stateArray.get(e).filter(o => o.name === name)[0]
            ];
        }

        stateArray.get(e).push(new Observer())
        return [
            () => stateArray.get(e).filter(o => o.name === name)[0].value, 
            v => (stateArray.get(e).filter(o => o.name === name)[0].value = v), 
            stateArray.get(e).filter(o => o.name === name)[0]
        ];
    }
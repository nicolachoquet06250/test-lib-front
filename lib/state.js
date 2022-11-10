export const availableEvents = {
    change: 'change'
};

export class State {
    /**
     * @param {unknown} v 
     */
    constructor(v) {
        this.#value = v;
    }

    /**
     * @type {Map<string, Array<(() => null)>>}
     */
    #events = new Map()
    /**
     * @type {unknown}
     */
    #value

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
                //console.log(eventCb)
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
 * @param {unknown} dv 
 * @returns {[() => unknown, (v: unknown) => void, Observer]}
 */
export const state = dv => {
    const s = new State(dv);

    class Observer {
        /**
         * @param {keyof availableEvents} event 
         * @param {((old: unknown, newV: unknown) => null)} cb 
         */
         addEventListener(event, cb) {
            s.addEventListener(event, cb)
        }
    }

    return [() => s.value, v => (s.value = v), new Observer()]
}
/**
 * Since storing data in session is likely a Key-Value store.
 * So using ES6 Map is a convenient implementation.
 *
 */
export default class SessionManager extends Map {

    static storable(payload) {
        if (payload === 0) {
            return true;
        }
        return !!payload;
    }

    /**
     *
     * @param entries
     */
    load(entries) {
        entries.forEach(entry => {

            const [key, value]          = entry;
            const { metadata, payload } = value;

            this.set(key, payload, v => v, metadata);
        });

        return this;
    }

    /**
     * Store a data into session
     *
     * @param {string} key
     * @param {*} value
     * @param {Function} serializeFunction
     * @param metadata
     * @return {SessionManager}
     */
    set(key, value, serializeFunction = (v) => v, metadata = {}) {
        if ('string' !== typeof key) {
            throw new Error("E_SESSION: Key of the session must be a string");
        }

        const payload = serializeFunction(value);

        if (!SessionManager.storable(payload)) {
            throw new Error("E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN");
        }

        return super.set(key, {metadata, payload});
    }

    /**
     * Wrapper for delete
     *
     * @param key
     */
    unset(key) {
        this.delete(key);
    }

    /**
     * Clear all of the session data
     */
    forget() {
        this.clear();
    }

    /**
     * Get a session value
     *
     * @param {string} key
     * @param {*} defaultIfNotExisted
     * @param {Function} deserializeFunction
     */
    get(key, defaultIfNotExisted = null, deserializeFunction = (v) => v) {
        if (!super.has(key)) {
            return defaultIfNotExisted;
        }

        let {metadata, payload} = super.get(key);

        if (metadata.flash) {
            this.delete(key);
        }

        return deserializeFunction(payload);
    }

    /**
     *
     * @param key
     * @param value
     * @param serializeFunction
     * @param metadata
     */
    flash(key, value, serializeFunction = (v) => v, metadata = {}) {
        return this.set(key, value, serializeFunction, {...metadata, flash: true});
    }

    /**
     * Serialize the session data
     */
    serialize() {
        return Array.from(this.entries());
    }
}

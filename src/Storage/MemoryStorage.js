import lodash from "lodash";

export default class MemoryStorage {

    constructor() {
        this.internalStore = new Map();
    }

    /**
     *
     * @param key
     * @param value
     * @param {{value: string, tags: array, ttl: number}} options . ttl (seconds)
     * @return {Promise<void>}
     */
    async store(key, value, options = {}) {
        let tags        = options.tags || [];
        let ttl         = options.ttl  || 0;
        let savedAt     = new Date().getTime();

        if (!lodash.isArray(tags)) {
            tags = [tags];
        }

        this.internalStore.set(key, {value, tags, savedAt, ttl});
    }

    /**
     *
     * @param key
     * @return {Promise<*>}
     */
    async get(key) {
        const result = this.internalStore.get(key);

        if (!result) {
            return null;
        }

        if (this.expired(result)) {
            return null;
        }

        return {key, value: result.value};
    }

    /**
     *
     * @param key
     * @return {Promise<void>}
     */
    async remove(key) {
        this.internalStore.delete(key);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async flush() {
        this.internalStore.clear();
    }

    /**
     *
     * @return {Promise<MemoryStorage>}
     */
    async cleanUp() {
        this.internalStore.forEach((item, key) => {
            if (this.expired(item)) {
                this.internalStore.delete(key)
            }
        });

        return this;
    }

    /**
     *
     * @param tag
     * @return {Promise<Array>}
     */
    async getByTag(tag) {
        let items = [];
        this.internalStore.forEach((item, key) => {
            if (item.tags.includes(tag) && !this.expired(item)) {
                items.push({value: item.value, key});
            }
        });


        return items;
    }

    /**
     *
     * @param savedAt
     * @param ttl
     * @return {boolean}
     */
    expired({savedAt, ttl}) {
        if (ttl <= 0) {
            return false;
        }
        return new Date().getTime() > savedAt + (ttl * 1000);
    }

    /**
     *
     * @return {MemoryStorage}
     */
    static install() {
        return new MemoryStorage();
    }
}
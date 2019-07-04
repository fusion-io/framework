import lodash from "lodash";

export default class MemoryStorage {

    constructor() {
        this.internalStore = new Map();
    }

    async store(key, value, options = {}) {
        let tags = options.tags || [];

        if (!lodash.isArray(tags)) {
            tags = [tags];
        }

        this.internalStore.set(key, {value, tags});
    }

    async get(key, valueIfNotExisted = null) {
        const result = this.internalStore.get(key);
        if (!result) {
            return valueIfNotExisted;
        }
        return result.value;
    }

    async remove(key) {
        this.internalStore.delete(key);
    }

    async flush() {
        this.internalStore.clear();
    }

    getByTag(tag) {
        let items = [];

        this.internalStore.forEach((item,) => {
            if (item.tags.includes(tag)) {
                items.push(item.value);
            }
        });

        return items;
    }

    static install() {
        return new MemoryStorage();
    }
}

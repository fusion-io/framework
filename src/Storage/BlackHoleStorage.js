export default class BlackHoleStorage {

    async store(key, value, options = {}) {
    }

    async get(key) {
        return null;
    }

    async remove(key) {

    }

    async flush() {

    }

    async cleanUp() {

    }

    getByTag(tag) {
        return [];
    }

    static install() {
        return new BlackHoleStorage();
    }
}

export default class StorageBridgeSessionStore {
    constructor(storage) {
        this.storage = storage;
        this.using   = null;
    }

    use(storageName) {
         this.using = storageName;

         return this;
    }

    get(key, maxAge, { rolling }) {
        return this.storage.set(key)
    }

    set(key, oldSession, maxAge, { rolling, changed }) {

    }
    destroy(key) {

    }

    resolveStorageKey(key) {
        return `fusion${key}`
    }
}

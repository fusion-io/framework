import Manager from "../utils/Manager";
import BlackHoleStorage from "./BlackHoleStorage";
import MemoryStorage from "./MemoryStorage";

/**
 * Manager of the storage adapters
 */
export default class StorageManager extends Manager {

    constructor({defaultAdapter, adapters}) {
        super();

        this.defaultAdapter = defaultAdapter;
        this.adapterConfigs = adapters;

        // By default, we'll support 3 basic drivers only
        // other drivers will be supported when we develop the related package
        //     database, redis, memcached, mongodb
        this.drivers = {
            // "filesystem" : FileSystemStorage,
            "memory"     : MemoryStorage,
            "blackhole"  : BlackHoleStorage
        }
    }

    /**
     * @inheritDoc
     */
    getDefaultAdapterName() {
        return this.defaultAdapter;
    }

    /**
     * @inheritDoc
     */
    resolveDriver(adapterName) {

        const adapterConfig = this.adapterConfigs[adapterName];

        if (!adapterConfig) {
            throw new Error(`E_STORAGE: Adapter ${adapterName} is not configured`);
        }

        return adapterConfig['driver'];
    }

    /**
     *
     * @param key
     * @param value
     * @param serializer
     * @param opts
     * @return {Promise<void>}
     */
    async store(key, value, serializer = v => JSON.stringify(v), opts = {}) {
        const serializedValue = await serializer(value);
        await this.adapter().store(key, serializedValue, opts);
    }

    /**
     *
     * @param key
     * @param valueIfNotExisted
     * @param deserializer
     * @return {Promise<void>}
     */
    async get(key, valueIfNotExisted = null, deserializer = v => JSON.parse(v)) {
        const serializedValue = await this.adapter().get(key);

        if (serializedValue === null) {
            return valueIfNotExisted;
        }

        return await deserializer(serializedValue.value);
    }

    /**
     *
     * @param key
     * @return {Promise<void>}
     */
    async remove(key) {
        await this.adapter().remove(key);
    }

    /**
     *
     * @param tag
     * @param deserializer
     * @return {Promise<*>}
     */
    async getByTag(tag, deserializer = v => JSON.parse(v)) {
        if (!this.adapter().getByTag) {
            return [];
        }

        const taggedResults = await this.adapter().getByTag(tag);

        return await Promise
            .all(taggedResults.map(serializedResult => deserializer(serializedResult.value)))
        ;
    }
}

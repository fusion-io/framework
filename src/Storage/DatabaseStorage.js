import lodash from "lodash";
import {container} from "@fusion.io/container";
import {Database} from "../Contracts";

export default class DatabaseStorage {
    constructor(connection) {
        this.connection = connection;
        this.tableName  = 'storage';
        this.ttl        = 60 * 60 * 24; // One day
    }

    setTable(tableName) {
        this.tableName = tableName;

        return this;
    }

    setDefaultTTL(ttl) {
        this.ttl = ttl;

        return this;
    }

    buildTagFieldValue(tags) {
        return '|' + tags.join('|') + '|';
    }

    guessTTL(options) {
        if (!options.ttl) {
            return this.ttl;
        }

        if (options.ttl < 0) {
            return this.ttl;
        }

        return options.ttl;
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
        let expiredAt   = Date.now() + (this.guessTTL(options) * 1000);

        if (!lodash.isArray(tags)) {
            tags = [tags];
        }

        const tagFieldValue = this.buildTagFieldValue(tags);

        const isExisted = await this.connection
            .from(this.tableName)
            .where({key})
            .first()
        ;

        if (isExisted) {
            return await this.connection
                .update({value, tags: tagFieldValue, expiredAt})
                .where({key})
                .table(this.tableName)
            ;
        }

        await this.connection
            .insert({key, value, tags: tagFieldValue, expiredAt})
            .into(this.tableName)
        ;
    }

    /**
     *
     * @param key
     * @return {Promise<*>}
     */
    async get(key) {

        let result = await this.connection
            .select()
            .table(this.tableName)
            .where({key})
            .where('expiredAt', '>=', Date.now())
            .orderBy('id', 'desc')
            .first()
        ;

        if (!result) {
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
        await this.connection.from(this.tableName).where({key}).delete();
    }

    /**
     *
     * @return {Promise<void>}
     */
    async flush() {
        await this.connection.truncate(this.tableName);
    }

    /**
     *
     * @return {Promise<MemoryStorage>}
     */
    async cleanUp() {
        await this.connection.from(this.tableName)
            .where('expiredAt', '<', Date.now())
            .delete()
        ;
    }

    /**
     *
     * @param tag
     * @return {Promise<Array>}
     */
    async getByTag(tag) {
        const resultSet = await this.connection
            .from(this.tableName)
            .select('*')
            .where('expiredAt', '>=', Date.now())
            .where('tags', 'like', `%|${tag}|%`)
            .from(this.tableName)
            .orderBy('id', 'desc')
        ;

        return resultSet.map(({key, value}) => ({key, value}));
    }

    /**
     *
     * @return {DatabaseStorage}
     */
    static install(adapterName, manager) {

        const {connection, tableName, ttl} = manager.configOf(adapterName);
        const dbm = container.make(Database);

        const adapter = new DatabaseStorage(dbm.connection(connection));

        if (tableName) {
            adapter.setTable(tableName);
        }

        if (ttl) {
            adapter.setDefaultTTL(ttl);
        }

        return adapter;
    }
}
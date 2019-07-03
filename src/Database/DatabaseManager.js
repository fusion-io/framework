import knex from "knex";
import Manager from "../utils/Manager";

export default class DatabaseManager extends Manager {

    constructor({connections, defaultConnection}) {
        super();

        this.connectionConfig   = connections;
        this.defaultConnection  = defaultConnection;

        this.drivers['knex'] = (connectionName) => {
            const connectionConfig = this.connectionConfig[connectionName];

            if (!connectionConfig) {
                throw new Error(`E_DATABASE: The connection [${connectionName}] is not configured`);
            }

            return knex(connectionConfig);
        }
    }

    connection(connectionName = null) {
        return this.adapter(connectionName);
    }

    getDefaultAdapterName() {
        return this.defaultConnection;
    }

    resolveDriver(connectionName) {
        return 'knex';
    }
}

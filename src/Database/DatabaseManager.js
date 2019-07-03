import knex from "knex";

export default class DatabaseManager {

    constructor({connections, defaultConnection}) {
        this.connectionConfig   = connections;
        this.defaultConnection  = defaultConnection;
        this.connections        = {};
    }

    connection(connectionName = null) {

        if (!connectionName) {
            connectionName = this.defaultConnection;
        }

        if (!this.created(connectionName)) {
            this.connections[connectionName] = this.createConnection(this.configOf(connectionName));
        }

        return this.connections[connectionName];
    }

    configOf(connectionName) {

        const config = this.connectionConfig[connectionName];

        if (!config) {
            throw new Error(`E_DATABASE: Database [${connectionName}] is not configured`);
        }

        return this.connectionConfig[connectionName];
    }

    created(connectionName) {
        return !!this.connections[connectionName];
    }

    createConnection(config) {
        return knex(config)
    }
}

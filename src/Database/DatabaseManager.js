import Manager from "../utils/Manager";

export default class DatabaseManager extends Manager {

    constructor(defaultConnection) {
        super();

        this.defaultConnection  = defaultConnection;
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

import ServiceProvider from "../utils/ServiceProvider";
import {Config, Database} from "../Contracts";
import DatabaseManager from "./DatabaseManager";
import knex from "knex";

export default class DatabaseServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Database, container => {
            const config = container.make(Config);

            const {defaultConnection, connections} = config.get('database');

            const KnexDriver = connectionName => {

                const connectionConfig = connections[connectionName];

                if (!connectionConfig) {
                    throw new Error(`E_DATABASE: Connection ${connectionName} is not configured`);
                }

                return knex(connectionConfig);
            };

            return new DatabaseManager(defaultConnection).registerDriver('knex', KnexDriver);
        });
    }
}

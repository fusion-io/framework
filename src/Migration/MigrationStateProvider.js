export default class MigrationStateProvider {
    constructor(connection) {
        this.connection = connection;
    }

    async initIfNotInitialized() {
        if (! await this.connection.schema.hasTable(this.table)) {
            await this.connection.schema.createTable(this.table, (table) => {
                table.increments();
                table.string('migration').notNullable();
                table.bigInteger('runAt');
            });
        }
    }

    setTable(table) {
        this.table = table;

        return this;
    }

    async get() {
        await this.initIfNotInitialized();

        return await this.connection.from(this.table);
    }

    async sync(deltaState) {
        return await this.connection.from(this.table).insert(deltaState);
    }

    purge(deltaState) {
        return this.connection
            .from(this.table)
            .whereIn('id', deltaState.map(migration => migration.id)).del()
        ;
    }
};

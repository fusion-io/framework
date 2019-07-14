import {Database} from "../../../Contracts";
import MigrationStateProvider from "../../../Migration/MigrationStateProvider";
import MigrationsProvider from "../../../Migration/MigrationsProvider";

export const command = "down";
export const desc    = "Rollback migrations";
export const builder = yargs => {
    yargs.option("t", {
        alias: "to",
        desc: "Rollback to given version name",
        type: "string"
    });

    yargs.option("n", {
        alias: "number",
        desc: "Rollback a number of versions",
        type: "number",
        default: 1
    });

    yargs.option("f", {
        alias: "force",
        desc: "Force run the migrations",
    });

    yargs.option("r", {
        alias: "reset",
        desc: "Reset all of the migrations",
    });

    yargs.option("c", {
        alias: "connection",
        desc: "Specify the database connection",
        type: "string"
    });
};

export const handler  = async ({container, connection, rc, number, to, reset}) => {
    const dbm  = container.make(Database);
    const dbc  = dbm.connection(connection);

    const stateProvider     = new MigrationStateProvider(dbc).setTable(rc.migrations.table);
    const migrationProvider = new MigrationsProvider(process.cwd() + '/' + rc.migrations.directory);
    const set               = await migrationProvider.load();

    set.setState(await stateProvider.get());
    set.migrated(migration => {
        console.log(chalk.cyan(migration));
    });

    const hasBeenMigrated   = set.hasBeenMigrated();

    if (!hasBeenMigrated.length) {
        console.log(chalk.gray('Nothing to migrate'));
        process.exit(0);
    }

    let provisioned = [];

    // Start the database transaction

    if (reset) {
        provisioned = await set.reset(dbc);
    } else if (to) {
        provisioned = await set.downTo(to, dbc);
    } else {
        provisioned = await set.down(number, dbc);
    }

    await stateProvider.purge(provisioned);

    process.exit(0);
};

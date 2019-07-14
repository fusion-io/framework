export const command     = "run <seeder>";
export const desc        = "Run a seeder";
export const builder     = yargs => {
    yargs.positional("seeder", {
        description: "Seeder name",
        type: "string"
    });
};

export const handler = async ({container, seeder, rc}) => {

    const Seeder = require(
        process.cwd() + '/' + rc.seeders.directory + '/' + seeder + 'Seeder.seeder.js'
    ).default;

    await new Seeder().seed();

    process.exit(0);
};

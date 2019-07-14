import chalk from "chalk";

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

    chalk.gray(`Seeding ${chalk.cyan(Seeder)}`);

    await new Seeder().seed();

    chalk.green("Done");

    process.exit(0);
};

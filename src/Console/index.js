export const command = ['framework'];
export const desc    = "Fusion CLI";
export const builder = yargs => {
    yargs.commandDir(__dirname + '/commands')
};

export const handler = () => { };

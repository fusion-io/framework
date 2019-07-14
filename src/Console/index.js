export const command = ['$0'];

export const builder = yargs => {
    yargs.commandDir(__dirname + '/commands')
};

export const handler = () => { };

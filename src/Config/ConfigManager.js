import NestedHash from "@fusion.io/bare/utils/NestedHash";

export default class ConfigManager extends NestedHash {

    constructor(config = {}) {
        super(config);

        this.currentEnv = '';
    }

    setEnv(environmentName, envConfig) {
        this.currentEnv = environmentName;

        this.merge(envConfig);

        return this;
    }

    env() {
        return this.currentEnv;
    }
}

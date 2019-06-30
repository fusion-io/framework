import ConfigManager from "../src/Config/ConfigManager";
import {assert} from "chai";

describe('Test ConfigManager', () => {
    const manager = new ConfigManager({
        thisIsDefaultKey: 'value',
        nestedKey : {
            value1: "fromDefault",
            value2: "fromDefault"
        }
    });

    it('should has default config for default environment', () => {
        assert.equal(manager.env(), '');
        assert.equal(manager.get('thisIsDefaultKey'), 'value');
    });

    it('can switch environment', () => {
        manager.setEnv('otherEnv', {
            nestedKey: {
                value2: "Overwrite from environment"
            }
        });

        assert.equal(manager.env(), 'otherEnv');
        assert.deepEqual(
            manager.get('nestedKey'),
            {value1: "fromDefault", value2: "Overwrite from environment"}
        );
    })
});
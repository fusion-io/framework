import ServiceProvider from "../utils/ServiceProvider";
import {Validator} from "../Contracts";
import ValidatorRegistry from "./ValidatorRegistry";
import validator from "validator";
import lodash from "lodash";

/**
 * It's a variable, but I will use Capital since I always respect ChrisOhara
 * because of his library
 *
 * @type {{}}
 */
const ChrisOharaValidators = {
    contains: 'contains',
    isAfter: 'date.after'

    // TODO
};

export default class FormServiceProvider extends ServiceProvider {

    register() {
        this.container.value(Validator, new ValidatorRegistry());
    }

    boot() {
        const registry = this.container.make(Validator);

        lodash.forIn(ChrisOharaValidators, (validatorName, originalName) => {
            registry.register(validatorName, (value, ...args) => validator[originalName](value + '', ...args));
        });
    }
}

import ServiceProvider from "@fusion.io/bare/utils/ServiceProvider";
import {Hasher, Config} from "@fusion.io/bare";
import BCryptHasher from "./BCryptHasher";

export default class BCryptHasherServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Hasher, container => {
            const config = container.resolve(Config);

            return new BCryptHasher().setSaltRouds(config.get('hash.rounds', 10));
        });
    }
}


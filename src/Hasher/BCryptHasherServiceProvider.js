import BCryptHasher from "./BCryptHasher";
import {Config, Hasher, ServiceProvider} from "../index";

export default class BCryptHasherServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Hasher, container => {
            const config = container.make(Config);

            return new BCryptHasher().setSaltRouds(config.get('hash.rounds', 10));
        });
    }
}

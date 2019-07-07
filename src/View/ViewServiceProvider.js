import ServiceProvider from "../utils/ServiceProvider";
import {Config, View} from "../Contracts";
import ViewFactory from "./ViewFactory";
import ViewEngineNunjucks from "./NunjucksEngine/ViewEngineNunjucks";
import {FileSystemLoader, Environment as NunjucksEnv} from "nunjucks";

export default class ViewServiceProvider extends ServiceProvider {

    register() {
        this.container.value(View, new ViewFactory());
        this.container.singleton(ViewEngineNunjucks, (container) => {
            const config = container.make(Config);
            return new ViewEngineNunjucks(new NunjucksEnv(new FileSystemLoader(config.get('view.directory'))))
        });
    }
}

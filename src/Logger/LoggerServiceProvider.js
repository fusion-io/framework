import ServiceProvider from "@fusion.io/bare/utils/ServiceProvider";
import {Logger, Config} from "@fusion.io/bare";
import winston from "winston";

export default class LoggerServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Logger, (container) => {
            const config = container.resolve(Config);

            return winston.createLogger(config.get('logger'))
        });
    }
}

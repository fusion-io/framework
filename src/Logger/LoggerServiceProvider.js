import winston from "winston";
import {ServiceProvider, Logger, Config} from "../index";

export default class LoggerServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Logger, (container) => {
            const config = container.make(Config);

            return winston.createLogger(config.get('logger'))
        });
    }
}

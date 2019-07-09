import {Logger} from "../Contracts";
import {container} from "@fusion.io/container";

export default class MailTransportLogger {

    constructor(logger) {
        this.logger = logger;
    }

    async sendMail(data) {
        this.logger.debug(`Email sent.\n${JSON.stringify(data, null, 4)}\n`);
    }

    static install() {
        return new MailTransportLogger(container.make(Logger));
    }
}

import Manager from "../utils/Manager";
import NodeMailerDriver from "./NodeMailerDriver";
import MailTransportLogger from "./MailTransportLogger";

export default class Mailer extends Manager {

    constructor({defaultTransport, transports}) {
        super();
        this.transportConfig    = transports;
        this.defaultTransport   = defaultTransport;

        this.drivers = {
            nodemailer  : NodeMailerDriver,
            logger      : MailTransportLogger
        }
    }

    configOf(transport) {
        return this.transportConfig[transport];
    }

    getDefaultAdapterName() {
        return this.defaultTransport;
    }

    resolveDriver(adapterName) {
        if (this.configOf(adapterName)['transport'] === 'log') {
            return 'logger';
        }
        return "nodemailer";
    }

    transport(name = null) {
        return this.adapter(name);
    }

    /**
     *
     * @param email
     * @param via
     * @return {*}
     */
    send(email, via = null) {
        return this.transport(via).sendMail(email.toJson());
    }
}

import ServiceProvider from "../utils/ServiceProvider";
import {Config, Mailer as MailerInterface} from "../Contracts";
import Mailer from "./Mailer";

export default class MailerServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(MailerInterface, container => {
            const config = container.make(Config);

            return new Mailer(config.get('mail'));
        })
    }
}

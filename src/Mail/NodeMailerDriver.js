import nodemailer from "nodemailer";

export default class NodeMailerDriver {

    static install(adapterName, manager) {
        return nodemailer.createTransport(manager.configOf(adapterName));
    }
}

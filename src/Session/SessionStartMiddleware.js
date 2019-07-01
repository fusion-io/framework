import {namespace} from "@fusion.io/bare";

@namespace('Fusion.Session')
export default class SessionStartMiddleware {
    constructor(koaSessionMiddleware, sessionManager) {
        this.koaSessionMiddleware = koaSessionMiddleware;
        this.sessionManager       = sessionManager;
    }

    async handle(context, next) {
        this.sessionManager.load(context.session['$$FUSION_$$SESSION']);
        await this.koaSessionMiddleware(context, next);
        context.session['$$FUSION_$$SESSION'] = this.sessionManager.serialize();
    }
}

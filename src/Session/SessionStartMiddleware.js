import {namespace} from "@fusion.io/bare";
import lodash from "lodash";

const sessionNamespace = '$$FUSION_$$SESSION';

@namespace('Fusion.Session')
export default class SessionStartMiddleware {
    constructor(koaSessionMiddleware, sessionManager, logger) {
        this.koaSessionMiddleware = koaSessionMiddleware;
        this.sessionManager       = sessionManager;
        this.logger               = logger;
    }

    async handle(context, next) {
        let rawSessionData = context.session[sessionNamespace] || [];

        if (!lodash.isArray(rawSessionData)) {
            this.logger.warn('Session data seems not be serialized correctly. Re-initialized as empty.', [{rawSessionData}]);
            rawSessionData = [];
        }

        this.sessionManager.load(rawSessionData);

        await this.koaSessionMiddleware(context, next);

        context.session[sessionNamespace] = this.sessionManager.serialize();
    }
}

import {namespace} from "@fusion.io/bare";
import lodash from "lodash";
import SessionManager from "./SessionManager";

const sessionNamespace = '$$FUSION_$$SESSION';

@namespace('Fusion.Session')
export default class SessionStartMiddleware {
    constructor(koaSessionMiddleware, logger) {
        this.koaSessionMiddleware = koaSessionMiddleware;
        this.logger               = logger;
    }

    async handle(context, next) {
        let rawSessionData = context.session[sessionNamespace] || [];

        if (!lodash.isArray(rawSessionData)) {
            this.logger.warn('Session data seems not be serialized correctly. Re-initialized as empty.', [{rawSessionData}]);
            rawSessionData = [];
        }

        let sessionManager = new SessionManager();

        sessionManager.load(rawSessionData);

        context.Session = sessionManager;

        await this.koaSessionMiddleware(context, next);

        context.session[sessionNamespace] = sessionManager.serialize();
    }
}

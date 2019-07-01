import SessionManager from "./SessionManager";
import SessionStartMiddleware from "./SessionStartMiddleware";
import koaSessionFactory from "koa-session";
import {Config, Kernel, Logger, Session} from "../Contracts";
import ServiceProvider from "../utils/ServiceProvider";

export default class SessionServiceProvider extends ServiceProvider {

    register() {
        this.container.bind(Session, () => new SessionManager());
        this.container.singleton(SessionStartMiddleware, (container) => {

            const config     = container.make(Config);
            const koaSession = koaSessionFactory(
                {
                    ...config.get('http.session', {}),
                    autoCommit: false
                },
                container.make(Kernel)
            );

            return new SessionStartMiddleware(
                koaSession,
                container.make(Session),
                container.make(Logger)
            )
        });
    }
}

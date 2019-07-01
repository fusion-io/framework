import SessionManager from "./SessionManager";
import SessionStartMiddleware from "./SessionStartMiddleware";
import koaSessionFactory from "koa-session";
import {KERNEL} from "../Http";
import ServiceProvider from "../utils/ServiceProvider";
import {Config, Logger, Session} from "../index";

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
                container.resolve(KERNEL)
            );

            return new SessionStartMiddleware(
                koaSession,
                container.resolve(Session),
                container.resolve(Logger)
            )
        });
    }
}

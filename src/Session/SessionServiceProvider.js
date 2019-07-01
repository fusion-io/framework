import ServiceProvider from "@fusion.io/bare/utils/ServiceProvider";
import {Session} from "@fusion.io/bare";
import SessionManager from "./SessionManager";
import SessionStartMiddleware from "./SessionStartMiddleware";
import koaSessionFactory from "koa-session";
import {KERNEL} from "../Http";

export default class SessionServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(Session, () => new SessionManager());

        this.container.singleton(this.container.constructor.guessTargetName(SessionStartMiddleware), (container) => {
            const koaSession = koaSessionFactory({}, container.resolve(KERNEL));

            return new SessionStartMiddleware(
                koaSession,
                container.resolve(Session)
            )
        });
    }
}

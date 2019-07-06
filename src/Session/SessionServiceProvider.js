import koaSessionFactory from "koa-session";
import {Config, Storage} from "../Contracts";
import ServiceProvider from "../utils/ServiceProvider";
import StorageBridgeSessionStore from "./StorageBridgeSessionStore";
import SessionStartMiddleware from "./SessionStartMiddleware";
import Kernel from "../Http/Kernel";
import ContextSessionMethods from "./ContextSessionMethods";

export default class SessionServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(SessionStartMiddleware, (container) => {

            const config        = container.make(Config);
            const storeManager  = container.make(Storage);
            const bridge        = new StorageBridgeSessionStore(storeManager);

            return [
                koaSessionFactory(
                    { ...config.get('http.session.options'), store: bridge },
                    container.make(Kernel)
                ),
                ContextSessionMethods
            ];
        });
    }
}

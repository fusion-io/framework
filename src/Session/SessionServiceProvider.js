import koaSessionFactory from "koa-session";
import {Config, Storage} from "../Contracts";
import ServiceProvider from "../utils/ServiceProvider";
import StorageBridgeSessionStore from "./StorageBridgeSessionStore";
import StartSession from "./StartSession";
import Kernel from "../Http/Kernel";
import ContextSessionMethods from "./ContextSessionMethods";

export default class SessionServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(StartSession, (container) => {

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

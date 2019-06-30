import {container} from "@fusion.io/bare";

export default class RouteRegistry {

    constructor(registry = []) {
        this.registry = registry;
    }

    register(method, url, handlers) {
        this.registry.push({
            method, url, handlers
        });

        return this;
    }

    createControllerActionHandler(ControllerSymbol, actionName = "handle", dependencies = []) {
        return async (context, next) => {
            const methodDependencyInstances = dependencies.map(dependency => container.resolve(dependency));
            await container.invoke(
                ControllerSymbol, actionName,
                context, next, ...methodDependencyInstances
            );
        }
    }

    applyRoutes(router) {
        this.registry.forEach(route => {
            const {
                method, url, handlers
            } = route;

            router[method](url, ...handlers);
        });
    }
}

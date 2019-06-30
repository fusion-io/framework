import HttpServiceProvider, {KERNEL, ROUTER, REGISTRY} from "./HttpServiceProvider";
import RouteRegistry from "./RouteRegistry";

export const registry = new RouteRegistry();

export const route = (
    method,
    url,
    middlewares = [],
    actionDependencies = []
) => (
    Target,
    actionMethod
) => {
    const middlewareHandlers = middlewares.map(Middleware => registry.createControllerActionHandler(Middleware));
    const controllerHandler  = registry.createControllerActionHandler(Target.constructor, actionMethod, actionDependencies);

    registry.register(method.toLowerCase(), url, [ ...middlewareHandlers, controllerHandler]);
};

export const get    = (url, middlewares = [], actionDependencies = []) => route('get', url, middlewares, actionDependencies);
export const post   = (url, middlewares = [], actionDependencies = []) => route('post', url, middlewares, actionDependencies);
export const del    = (url, middlewares = [], actionDependencies = []) => route('del', url, middlewares, actionDependencies);
export const put    = (url, middlewares = [], actionDependencies = []) => route('put', url, middlewares, actionDependencies);
export const patch  = (url, middlewares = [], actionDependencies = []) => route('patch', url, middlewares, actionDependencies);
export const any    = (url, middlewares = [], actionDependencies = []) => route('any', url, middlewares, actionDependencies);

export {
    HttpServiceProvider,
    KERNEL,
    ROUTER,
    REGISTRY
};
